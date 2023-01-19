import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { passwordValidator } from './validators';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = Object.assign(new User(), args.input);

      if (!passwordValidator(user.password)) {
        throw new Error('Password is not valid');
      }

      await AppDataSource.manager.save(user);

      return user;
    },
  },
};
