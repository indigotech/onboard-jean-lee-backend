import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../..') + '/test.env' });

import axios from 'axios';
import { expect } from 'chai';
import { initializeServer } from '../server';

describe('test hello query', () => {
  before('starting server', async () => {
    await initializeServer();
  });

  it('should get the correct response for the hello query', async () => {
    const response = await axios.post(`http://localhost:4000`, { query: 'query { hello }' });
    expect(response.data).to.be.deep.equal({ data: { hello: 'Hello world!' } });
  });
});
