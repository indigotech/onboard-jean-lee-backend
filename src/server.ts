import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AppDataSource } from './data/data-source';
import { errorFormatter } from './error-formatter';
import { resolvers } from './resolver';
import { typeDefs } from './schema';

export const initializeApolloServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers, formatError: errorFormatter });

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT ? +process.env.PORT : 4000 },
    context: async ({ req }) => ({ token: req.headers?.authorization }),
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
