import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..') + '/test.env' });

import { faker } from '@faker-js/faker';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';

export function createRandomUser(): Omit<User, 'id'> {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    birthDate: faker.date.birthdate().toLocaleDateString('pt-br'),
  };
}

async function saveToDatabase(users: User[]) {
  await AppDataSource.initialize();
  await AppDataSource.manager.save<User>(users);
  console.log(`Saved ${users.length} users to test database`);
}

const seededUsers: User[] = [];
Array.from({ length: 50 }).forEach(() => {
  const user = Object.assign(new User(), createRandomUser());
  seededUsers.push(user);
});

saveToDatabase(seededUsers);
