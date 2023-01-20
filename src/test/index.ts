import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../..') + '/test.env' });

import axios from 'axios';
import { expect } from 'chai';
import { initializeServer } from '../server';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as crypto from 'crypto';

before('starting server', async () => {
  await initializeServer();
});

describe('Query - hello', () => {
  it('should get the correct response for the hello query', async () => {
    const response = await axios.post(`http://localhost:4000`, { query: 'query { hello }' });
    expect(response.data).to.be.deep.equal({ data: { hello: 'Hello world!' } });
  });
});

describe('Mutation - createUser', () => {
  afterEach('clearing User table', () => {
    AppDataSource.getRepository(User).clear();
  });

  it('should successfully create a new user', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };
    const hashedPassword = crypto.createHash('sha1').update(userInput.password).digest('base64');

    const responseUser = (
      await axios.post(`http://localhost:4000`, {
        query: 'mutation CreateUser($input: UserInput!) { createUser(input: $input) { id name email birthDate } }',
        variables: { input: userInput },
      })
    ).data.data.createUser;

    const databaseUser = await AppDataSource.getRepository(User).findOneBy({ id: responseUser.id });

    expect(responseUser).to.be.deep.eq({
      id: databaseUser.id,
      name: userInput.name,
      email: userInput.email,
      birthDate: userInput.birthDate,
    });
    expect(responseUser.password).to.be.undefined;
    expect(databaseUser).to.be.deep.eq({
      id: responseUser.id,
      name: userInput.name,
      email: userInput.email,
      birthDate: userInput.birthDate,
      password: hashedPassword,
    });
  });
});
