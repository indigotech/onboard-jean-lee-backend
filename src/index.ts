import { AppDataSource } from './data-source';
import { initializeApolloServer } from './server';

export const initializeServer = async () => {
  try {
    await AppDataSource.initialize();
    await initializeApolloServer();
  } catch (error) {
    console.log(error);
  }
};

initializeServer();
