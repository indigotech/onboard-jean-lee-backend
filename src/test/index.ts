import axios from 'axios';
import { initializeServer } from '..';
import { expect } from 'chai';

describe('test hello query', () => {
  before('starting server', async () => {
    await initializeServer();
  });

  it('should get the correct response for the hello query', async () => {
    const response = await axios.post(`http://localhost:4000`, { query: 'query { hello }' });
    expect(response.data).to.be.deep.equal({ data: { hello: 'Hello world!' } });
  });
});
