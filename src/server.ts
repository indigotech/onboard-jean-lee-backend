import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data-source';
import { resolvers } from './resolver';
import { typeDefs } from './schema';

export const initializeApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

export const initializeServer = async () => {
  try {
    await AppDataSource.initialize();
    await initializeApolloServer();
  } catch (error) {
    console.log(error);
  }
};
