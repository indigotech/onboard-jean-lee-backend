import { expect } from 'chai';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as crypto from 'crypto';
import { StatusCodes } from '../error-formatter';
import { gql } from 'graphql-tag';
import { UserFragment } from './fragments.test';
import { JwtService } from '../jwt.service';
import { requestMaker } from './request-maker';

const query = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      ${UserFragment}
    }
  }
`;

describe('Mutation - createUser', () => {
  afterEach('clearing User table', () => {
    AppDataSource.getRepository(User).clear();
  });

  it('should successfully create a new user', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };
    const hashedPassword = crypto.scryptSync(userInput.password, process.env.CRYPTO_SALT, 64).toString();
    const authToken = JwtService.sign({ id: 1 });

    const responseUser = (await createUser(userInput, authToken)).data.createUser;

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

  it('should return an error if the user is not authorized', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };

    const response = (await requestMaker.post({ query, variables: { input: userInput } })).data;

    const expectedError = { code: StatusCodes.Unauthorized, message: 'Invalid token' };

    expect(response.data.createUser).to.be.null;
    expect(response.errors[0]).to.be.deep.eq(expectedError);
  });

  it('should return an error if the token is invalid', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };
    const authToken = JwtService.sign({});

    const response = await createUser(userInput, authToken);

    const expectedError = { code: StatusCodes.Unauthorized, message: 'Invalid token' };

    expect(response.data.createUser).to.be.null;
    expect(response.errors[0]).to.be.deep.eq(expectedError);
  });

  it('should return an error if the token is expired', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };
    const authToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo3fSwiaWF0IjoxNjc0NzU1OTYxLCJleHAiOjE2NzQ3NTk1NjF9.pwEShSspHjgUKLchs7-ZvbDRQhy2JOG5_gPk_hPr3ck';

    const response = await createUser(userInput, authToken);

    const expectedError = { code: StatusCodes.Unauthorized, message: 'Invalid token' };

    expect(response.data.createUser).to.be.null;
    expect(response.errors[0]).to.be.deep.eq(expectedError);
  });

  it('should return an error if the password is invalid', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'invalid', birthDate: '01-01-2000' };
    const authToken = JwtService.sign({ id: 1 });

    const response = await createUser(userInput, authToken);
    const expectedError = { code: StatusCodes.BadUserInput, message: 'Password is not valid' };

    expect(response.data.createUser).to.be.null;
    expect(response.errors[0]).to.be.deep.eq(expectedError);
  });

  it('should return an error if the email is already in use', async () => {
    const userInput = { name: 'Test', email: 'test@test.com', password: 'password1', birthDate: '01-01-2000' };
    const authToken = JwtService.sign({ id: 1 });

    const firstResponseUser = (await createUser(userInput, authToken)).data.createUser;

    const secondResponse = await createUser(userInput, authToken);

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

const createUser = async (userInput, token) => {
  return (await requestMaker.post({ query, variables: { input: userInput }, headers: { authorization: token } })).data;
};
