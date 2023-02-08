import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Address } from './entity/Address';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Address],
  migrations: [],
  subscribers: [],
});
