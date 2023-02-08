import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..') + '/test.env' });

import { seedUsers } from '../src/data/seeder';

seedUsers();
console.log('Created 50 users in test database');
