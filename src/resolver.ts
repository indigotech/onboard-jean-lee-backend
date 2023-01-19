import { AppDataSource } from './data-source';
import { User } from './entity/User';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = Object.assign(new User(), args.input);

      await AppDataSource.manager.save(user);

      return user;
    },
  },
};
