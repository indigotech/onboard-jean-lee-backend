import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { gql } from 'graphql-tag';
import { UserFragment } from './fragments.test';
import { print } from 'graphql';
import { JwtService } from '../jwt.service';
import { StatusCodes } from '../error-formatter';

const query = gql`query User($id: Int!) { user(id: $id) { ${UserFragment} } }`;
const createUserQuery = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      ${UserFragment}
    }
  }
`;

const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };

describe('Query - user', () => {
  before('create test user', async () => {
    const authToken = JwtService.sign({ id: 1 });

    await axios.post(
      `http://localhost:4000`,
      {
        query: print(createUserQuery),
        variables: { input: userInput },
      },
      { headers: { authorization: authToken } },
    );
  });

  it('should return an error when an invalid authorization token is provided', async () => {
    const response = (await axios.post('http://localhost:4000', { query: print(query), variables: { id: 1 } })).data;

    expect(response.errors[0]).to.be.deep.eq({ code: StatusCodes.Unauthorized, message: 'Invalid token' });
    expect(response.data.user).to.be.null;
  });

  it('should receive correct response from the user query', async () => {
    const databaseUser = await AppDataSource.getRepository(User).findOneBy({ email: userInput.email });
    const authToken = JwtService.sign({ id: 1 });

    const response = (
      await axios.post(
        `http://localhost:4000`,
        {
          query: print(query),
          variables: { id: databaseUser.id },
        },
        { headers: { authorization: authToken } },
      )
    ).data;

    expect(response.data.user).to.be.deep.eq({
      id: databaseUser.id,
      name: userInput.name,
      email: userInput.email,
      birthDate: userInput.birthDate,
    });
  });

  it('should return an error when no user with input id exists', async () => {
    const authToken = JwtService.sign({ id: 1 });

    const response = (
      await axios.post(
        'http://localhost:4000',
        { query: print(query), variables: { id: 999 } },
        { headers: { authorization: authToken } },
      )
    ).data;

    expect(response.errors[0]).to.be.deep.eq({ message: 'User not found', code: StatusCodes.NotFound });
    expect(response.data.user).to.be.null;
  });

  after('clear User table', async () => {
    await AppDataSource.getRepository(User).clear();
  });
});
