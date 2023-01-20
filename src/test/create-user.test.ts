import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as crypto from 'crypto';
import { StatusCodes } from '../error-formatter';

const query = 'mutation CreateUser($input: UserInput!) { createUser(input: $input) { id name email birthDate } }';

describe('Mutation - createUser', () => {
  afterEach('clearing User table', () => {
    AppDataSource.getRepository(User).clear();
  });

  it('should successfully create a new user', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };
    const hashedPassword = crypto.scryptSync(userInput.password, process.env.CRYPTO_SALT, 64).toString();

    const responseUser = (
      await axios.post(`http://localhost:4000`, {
        query,
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

  it('should return an error if the password is invalid', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'invalid', birthDate: '01-01-2000' };

    const response = (
      await axios.post(`http://localhost:4000`, {
        query,
        variables: { input: userInput },
      })
    ).data;
    const expectedError = { code: StatusCodes.BadUserInput, message: 'Password is not valid' };

    expect(response.data.createUser).to.be.null;
    expect(response.errors[0]).to.be.deep.eq(expectedError);
  });

  it('should return an error if the email is already in use', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };

    const firstResponseUser = (
      await axios.post(`http://localhost:4000`, {
        query,
        variables: { input: userInput },
      })
    ).data.data.createUser;

    const secondResponse = (
      await axios.post(`http://localhost:4000`, {
        query,
        variables: { input: userInput },
      })
    ).data;

    expect(firstResponseUser).to.be.deep.eq({
      id: firstResponseUser.id,
      name: userInput.name,
      email: userInput.email,
      birthDate: userInput.birthDate,
    });

    expect(secondResponse.data.createUser).to.be.null;
    expect(secondResponse.errors[0]).to.be.deep.eq({ code: StatusCodes.Success, message: 'Email is already in use' });
  });
});
