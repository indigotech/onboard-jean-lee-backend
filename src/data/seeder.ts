import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';
import { Address } from './entity/Address';
import { User } from './entity/User';

export function createRandomUser(): Omit<User, 'id' | 'address'> {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    birthDate: faker.date.birthdate().toLocaleDateString('pt-br'),
  };
}

export function createRandomAddress(): Omit<Address, 'id' | 'user'> {
  return {
    cep: faker.address.zipCode(),
    street: faker.address.street(),
    streetNumber: +faker.address.buildingNumber(),
    complement: faker.address.secondaryAddress(),
    neighborhood: faker.address.county(),
    city: faker.address.city(),
    state: faker.address.state(),
  };
}

export async function seedUsers(count = 50) {
  !AppDataSource.isInitialized && (await AppDataSource.initialize());
  const seededUsers: User[] = [];
  Array.from({ length: count }, () => {
    const user = Object.assign(new User(), createRandomUser());
    user.address = seedAddresses(user, Math.ceil(Math.random() * 3));
    seededUsers.push(user);
  });
  await AppDataSource.manager.save<User>(seededUsers);
}

export function seedAddresses(user: User, count = 1) {
  const seededAddresses: Address[] = [];
  Array.from({ length: count }).forEach(async () => {
    const address = Object.assign(new Address(), createRandomAddress());
    address.user = user;
    seededAddresses.push(address);
  });
  return seededAddresses;
}
