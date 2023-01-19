import { AppDataSource } from './data-source';
import { initializeApolloServer } from './server';

AppDataSource.initialize()
  .then(async () => {
    await initializeApolloServer();
  })
  .catch((error) => console.log(error));
