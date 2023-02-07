import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';
import { User } from './entity/User';

export function createRandomUser(): Omit<User, 'id'> {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    birthDate: faker.date.birthdate().toLocaleDateString('pt-br'),
  };
}

export async function seedUsers(count = 50) {
  !AppDataSource.isInitialized && (await AppDataSource.initialize());
  const seededUsers: User[] = [];
  Array.from({ length: count }).forEach(async () => {
    const user = Object.assign(new User(), createRandomUser());
    seededUsers.push(user);
  });
  await AppDataSource.manager.save<User>(seededUsers);
}
