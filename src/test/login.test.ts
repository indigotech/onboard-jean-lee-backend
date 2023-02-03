import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { StatusCodes } from '../error-formatter';
import { gql } from 'graphql-tag';
import { LoginFragment, UserFragment } from './fragments.test';
import { JwtService } from '../jwt.service';
import { requestMaker } from './request-maker';

const ONE_MINUTE = 60;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_WEEK = 7 * 24 * ONE_HOUR;

const loginQuery = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ${LoginFragment}
    }
  }
`;
const createUserQuery = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      ${UserFragment}
    }
  }
`;

const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };

describe('Mutation - login', () => {
  before('create test user', async () => {
    const authToken = JwtService.sign({ id: 1 });

    await requestMaker.post({
      query: createUserQuery,
      variables: { input: userInput },
      headers: { authorization: authToken },
    });
  });

  it('should receive correct response from the login mutation', async () => {
    const loginInput = { email: userInput.email, password: userInput.password };

    const loginResponse = (await requestMaker.post({ query: loginQuery, variables: { input: loginInput } })).data.data
      .login;
    const databaseUser = await AppDataSource.getRepository(User).findOneBy({ email: loginInput.email });
    const decodedToken = JwtService.decode(loginResponse.token);

    expect(loginResponse.user).to.be.deep.eq({
      id: databaseUser.id,
      name: userInput.name,
      email: userInput.email,
      birthDate: userInput.birthDate,
    });
    expect(decodedToken.data).to.be.deep.eq({ id: databaseUser.id });
    expect(decodedToken.iat).to.be.approximately(Date.now() / 1000, ONE_MINUTE);
    expect(decodedToken.exp).to.be.approximately(Date.now() / 1000 + ONE_HOUR, ONE_MINUTE);
  });

  it('should receive correct response from the login mutation with extended token duration', async () => {
    const loginInput = { email: userInput.email, password: userInput.password, rememberMe: true };

    const loginResponse = (await requestMaker.post({ query: loginQuery, variables: { input: loginInput } })).data.data
      .login;
    const databaseUser = await AppDataSource.getRepository(User).findOneBy({ email: loginInput.email });
    const decodedToken = JwtService.decode(loginResponse.token);

    expect(loginResponse.user).to.be.deep.eq({
      id: databaseUser.id,
      name: userInput.name,
      email: userInput.email,
      birthDate: userInput.birthDate,
    });
    expect(decodedToken.data).to.be.deep.eq({ id: databaseUser.id });
    expect(decodedToken.iat).to.be.approximately(Date.now() / 1000, ONE_MINUTE);
    expect(decodedToken.exp).to.be.approximately(Date.now() / 1000 + ONE_WEEK, ONE_MINUTE);
  });

  it('should return an error if there is no user with the input email', async () => {
    const loginInput = { email: 'invalid@email.com', password: userInput.password };

    const loginResponse = (await requestMaker.post({ query: loginQuery, variables: { input: loginInput } })).data;

    expect(loginResponse.data.login).to.be.null;
    expect(loginResponse.errors[0]).to.be.deep.eq({ code: StatusCodes.NotFound, message: 'User not found' });
  });

  it('should return an error if the password is incorrect', async () => {
    const loginInput = { email: userInput.email, password: 'incorrect password' };

    const loginResponse = (await requestMaker.post({ query: loginQuery, variables: { input: loginInput } })).data;

    expect(loginResponse.data.login).to.be.null;
    expect(loginResponse.errors[0]).to.be.deep.eq({ code: StatusCodes.Unauthorized, message: 'Password is incorrect' });
  });

  after('clearing User table', async () => {
    await AppDataSource.getRepository(User).clear();
  });
});
