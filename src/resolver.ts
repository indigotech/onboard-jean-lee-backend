import { AppDataSource } from './data-source';
import { User } from './entity/User';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    createUser: async (parent, args) => {
      const input = args.input;
      const user = new User();
      user.name = input.name;
      user.email = input.email;
      user.password = input.password;
      user.birthDate = input.birthDate;

      await AppDataSource.manager.save(user);
      console.log('Saved a new user with id: ' + user.id);

      delete user.password;

      return user;
    },
  },
};
