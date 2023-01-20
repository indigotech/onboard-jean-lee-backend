import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { emailValidator, passwordValidator } from './validators';
import * as crypto from 'crypto';
import { ServerError, StatusCodes } from './error-formatter';

export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    createUser: async (parent, args) => {
      const hashedPassword = crypto.scryptSync(args.input.password, process.env.CRYPTO_SALT, 64).toString();
      const user = Object.assign(new User(), { ...args.input, password: hashedPassword });

      if (!passwordValidator(args.input.password)) {
        throw new ServerError('Password is not valid', StatusCodes.BadUserInput);
      }

      if (!(await emailValidator(user.email))) {
        throw new ServerError('Email is already in use', StatusCodes.Success);
      }

      await AppDataSource.manager.save(user);

      return user;
    },
  },
};
