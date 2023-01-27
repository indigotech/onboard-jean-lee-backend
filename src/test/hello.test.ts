import axios from 'axios';
import { expect } from 'chai';

const query = 'query { hello }';

describe('Query - hello', () => {
  it('should get the correct response for the hello query', async () => {
    const response = await axios.post(`http://localhost:4000`, { query });
    expect(response.data).to.be.deep.equal({ data: { hello: 'Hello world!' } });
  });
});
