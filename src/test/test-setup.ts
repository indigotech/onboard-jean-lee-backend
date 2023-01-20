import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../..') + '/test.env' });

import { initializeServer } from '../server';

before('starting server', async () => {
  await initializeServer();
});
