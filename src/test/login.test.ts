import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { StatusCodes } from '../error-formatter';

const loginQuery =
  'mutation Login($input: LoginInput!) { login(input: $input) { user { id name email birthDate } token } }';
const createUserQuery =
  'mutation CreateUser($input: UserInput!) { createUser(input: $input) { id name email birthDate } }';
const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };

describe('Mutation - login', () => {
  before('create test user', async () => {
    await axios.post(`http://localhost:4000`, {
      query: createUserQuery,
      variables: { input: userInput },
    });
  });

  it('should receive correct response from the login mutation', async () => {
    const loginInput = { email: userInput.email, password: userInput.password };

    const loginResponse = (
      await axios.post(`http://localhost:4000`, { query: loginQuery, variables: { input: loginInput } })
    ).data.data.login;
    const databaseUser = await AppDataSource.getRepository(User).findOneBy({ email: loginInput.email });

    expect(loginResponse).to.be.deep.eq({
      user: { id: databaseUser.id, name: userInput.name, email: userInput.email, birthDate: userInput.birthDate },
      token: '',
    });
  });

  it('should return an error if there is no user with the input email', async () => {
    const loginInput = { email: 'invalid@email.com', password: userInput.password };

    const loginResponse = (
      await axios.post(`http://localhost:4000`, { query: loginQuery, variables: { input: loginInput } })
    ).data;

    expect(loginResponse.data.login).to.be.null;
    expect(loginResponse.errors[0]).to.be.deep.eq({ code: StatusCodes.NotFound, message: 'User not found' });
  });

  it('should return an error if the password is incorrect', async () => {
    const loginInput = { email: userInput.email, password: 'incorrect password' };

    const loginResponse = (
      await axios.post(`http://localhost:4000`, { query: loginQuery, variables: { input: loginInput } })
    ).data;

    expect(loginResponse.data.login).to.be.null;
    expect(loginResponse.errors[0]).to.be.deep.eq({ code: StatusCodes.Unauthorized, message: 'Password is incorrect' });
  });

  after('clearing User table', async () => {
    await AppDataSource.getRepository(User).clear();
  });
});
