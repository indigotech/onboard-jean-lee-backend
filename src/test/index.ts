import axios from 'axios';
import { initializeServer } from '..';

describe('hello world', () => {
  before('starting server', async () => {
    await initializeServer();
  });

  it('will say hello', async () => {
    const response = await axios.post(`http://localhost:4000`, { query: 'query { hello }' });
    console.log(response.data);
  });
});
