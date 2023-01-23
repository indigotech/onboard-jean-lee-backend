import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { emailValidator, passwordValidator } from './validators';
import * as crypto from 'crypto';
import { ServerError, StatusCodes } from './error-formatter';
import { emailAvailableUseCase } from './domain/users/email-available.use-case';

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

      if (!emailValidator(args.input.email)) {
        throw new ServerError('Email is not valid', StatusCodes.BadUserInput);
      }

      if (!(await emailAvailableUseCase(user.email))) {
        throw new ServerError('Email is already in use', StatusCodes.Success);
      }

      await AppDataSource.manager.save(user);

      return user;
    },
    login: async (parent, args) => {
      const hashedPassword = crypto.scryptSync(args.input.password, 'salt', 64).toString('base64');
      const dbUser = await AppDataSource.manager.findOneBy(User, { email: args.input.email });

      if (!dbUser) {
        throw new ServerError('User not found', StatusCodes.NotFound);
      }

      if (dbUser.password !== hashedPassword) {
        throw new ServerError('Password is incorrect', StatusCodes.BadUserInput);
      }

      return { user: dbUser, token: '' };
    },
  },
};

export const mockLogin = {
  user: { id: 1, name: 'Test', email: 'test@test.com', birthDate: '01-01-2000' },
  token: 'token',
};
