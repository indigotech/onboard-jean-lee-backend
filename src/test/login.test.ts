import axios from 'axios';
import { expect } from 'chai';
import { mockLogin } from '../resolver';

const query = 'mutation Login($input: LoginInput!) { login(input: $input) { user { id name email birthDate } token } }';

describe('Mutation - login', () => {
  it('should receive mocked response from the login mutation', async () => {
    const loginInput = { email: '', password: '' };

    const response = (await axios.post(`http://localhost:4000`, { query, variables: { input: loginInput } })).data.data
      .login;

    expect(response).to.be.deep.eq(mockLogin);
  });
});
