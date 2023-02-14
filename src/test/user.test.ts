import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data/data-source';
import { User } from '../data/entity/User';
import { gql } from 'graphql-tag';
import { UserFragment } from './fragments.test';
import { print } from 'graphql';
import { JwtService } from '../jwt.service';
import { StatusCodes } from '../error-formatter';
import { seedUsers } from '../data/seeder';
import { requestMaker } from './request-maker';
import { clearRepository } from './repository-clear';
import { Address } from '../data/entity/Address';

const query = gql`query User($id: Int!) { user(id: $id) { ${UserFragment} } }`;

describe('Query - user', () => {
  before('create test user', async () => {
    await seedUsers(1);
  });

  it('should return an error when an invalid authorization token is provided', async () => {
    const response = (await axios.post('http://localhost:4000', { query: print(query), variables: { id: 1 } })).data;

    expect(response.errors[0]).to.be.deep.eq({ code: StatusCodes.Unauthorized, message: 'Invalid token' });
    expect(response.data.user).to.be.null;
  });

  it('should receive correct response from the user query', async () => {
    const databaseUser = (await AppDataSource.getRepository(User).find({ relations: { address: true } }))[0];
    const authToken = JwtService.sign({ id: 1 });

    const response = (
      await requestMaker.post({ query, variables: { id: databaseUser.id }, headers: { authorization: authToken } })
    ).data;

    expect(response.data.user).to.be.deep.eq({
      id: databaseUser.id,
      name: databaseUser.name,
      email: databaseUser.email,
      birthDate: databaseUser.birthDate,
      address: databaseUser.address,
    });
  });

  it('should return an error when no user with input id exists', async () => {
    const authToken = JwtService.sign({ id: 1 });

    const response = (
      await requestMaker.post({ query, variables: { id: 9999 }, headers: { authorization: authToken } })
    ).data;

    expect(response.errors[0]).to.be.deep.eq({ message: 'User not found', code: StatusCodes.NotFound });
    expect(response.data.user).to.be.null;
  });

  after('clear User table', async () => {
    await clearRepository(User);
    await clearRepository(Address);
  });
});
