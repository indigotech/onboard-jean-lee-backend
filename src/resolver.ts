import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { passwordValidator } from './validators';
import * as crypto from 'crypto';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    createUser: async (parent, args) => {
      const hashedPassword = crypto.scryptSync(args.input.password, 'salt', 64).toString();
      const user = Object.assign(new User(), { ...args.input, password: hashedPassword });

      if (!passwordValidator(args.input.password)) {
        throw new Error('Password is not valid');
      }

      await AppDataSource.manager.save(user);

      return user;
    },
  },
};
