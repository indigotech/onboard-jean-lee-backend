import { expect } from 'chai';
import { AppDataSource } from '../data/data-source';
import { User } from '../data/entity/User';
import { gql } from 'graphql-tag';
import { PaginatedUsersFragment } from './fragments.test';
import { StatusCodes } from '../error-formatter';
import { seedUsers } from '../data/seeder';
import { requestMaker } from './request-maker';
import { JwtService } from '../jwt.service';

const query = gql`query Users($input: UsersInput) { users(input: $input) { ${PaginatedUsersFragment} } }`;

const USERS_COUNT = 50;

describe('Query - users', () => {
  before('seed test users', async () => {
    await seedUsers(USERS_COUNT);
  });

  it('should return an error when an invalid authorization token is provided', async () => {
    const response = (await requestMaker.post({ query, headers: { authorization: 'invalid token' } })).data;

    expect(response.errors[0]).to.be.deep.eq({ code: StatusCodes.Unauthorized, message: 'Invalid token' });
    expect(response.data.users).to.be.null;
  });

  it('should return 10 users if no input is provided', async () => {
    const authToken = JwtService.sign({ id: 1 });
    const response = (await requestMaker.post({ query, headers: { authorization: authToken } })).data;

    expect(response.errors).to.be.undefined;
    expect(response.data.users.count).to.be.eq(USERS_COUNT);
    expect(response.data.users.users).to.have.lengthOf(10);
    expect(response.data.users.pageInfo).to.be.deep.eq({
      limit: 10,
      offset: 0,
      page: 1,
      totalPages: USERS_COUNT / 10,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('should return correct page info for last page', async () => {
    const authToken = JwtService.sign({ id: 1 });
    const response = (
      await requestMaker.post({
        query,
        variables: { input: { page: USERS_COUNT / 10 } },
        headers: { authorization: authToken },
      })
    ).data;

    expect(response.errors).to.be.undefined;
    expect(response.data.users.count).to.be.eq(USERS_COUNT);
    expect(response.data.users.users).to.have.lengthOf(10);
    expect(response.data.users.pageInfo).to.be.deep.eq({
      limit: 10,
      offset: USERS_COUNT - 10,
      page: USERS_COUNT / 10,
      totalPages: USERS_COUNT / 10,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it('should return 5 users if limit is 5', async () => {
    const authToken = JwtService.sign({ id: 1 });
    const response = (
      await requestMaker.post({
        query,
        variables: { input: { limit: 5 } },
        headers: { authorization: authToken },
      })
    ).data;

    expect(response.errors).to.be.undefined;
    expect(response.data.users.count).to.be.eq(USERS_COUNT);
    expect(response.data.users.users).to.have.lengthOf(5);
    expect(response.data.users.pageInfo).to.be.deep.eq({
      limit: 5,
      offset: 0,
      page: 1,
      totalPages: USERS_COUNT / 5,
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });

  it('should return an error if page is out of range', async () => {
    const authToken = JwtService.sign({ id: 1 });
    const response = (
      await requestMaker.post({
        query,
        variables: { input: { page: USERS_COUNT / 10 + 1 } },
        headers: { authorization: authToken },
      })
    ).data;

    expect(response.errors[0]).to.be.deep.eq({ code: StatusCodes.BadUserInput, message: 'Page out of range' });
    expect(response.data.users).to.be.null;
  });

  after('clear User table', async () => {
    await AppDataSource.getRepository(User).clear();
  });
});
