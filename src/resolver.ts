import * as crypto from 'crypto';
import { AppDataSource } from './data/data-source';
import { User } from './data/entity/User';
import { emailValidator, passwordValidator } from './validators';
import { ServerError, StatusCodes } from './error-formatter';
import { emailAvailableUseCase } from './domain/users/email-available.use-case';
import { JwtService } from './jwt.service';
import { createPageInfo } from './pagination';

export const resolvers = {
  User: {
    address(user: User) {
      return user.address?.length ? user.address : [];
    },
  },
  Query: {
    hello: () => 'Hello world!',
    user: async (_parent, args, context) => {
      if (!JwtService.validate(context.token)) {
        throw new ServerError('Invalid token', StatusCodes.Unauthorized);
      }

      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: args.id },
        relations: { address: true },
      });

      if (!user) {
        throw new ServerError('User not found', StatusCodes.NotFound);
      }

      return user;
    },
    users: async (_parent, args, context) => {
      if (!JwtService.validate(context.token)) {
        throw new ServerError('Invalid token', StatusCodes.Unauthorized);
      }

      const count = await AppDataSource.getRepository(User).count();
      const pageInfo = createPageInfo(args.input?.limit, args.input?.page, count);

      const users = await AppDataSource.getRepository(User).find({
        take: pageInfo.limit,
        skip: pageInfo.offset,
        order: { name: 'ASC' },
        relations: { address: true },
      });

      if (args.input?.page > pageInfo.totalPages || args.input?.page < 1) {
        throw new ServerError('Page out of range', StatusCodes.BadUserInput);
      }

      if (!users?.length) {
        throw new ServerError('Users not found', StatusCodes.NotFound);
      }

      return { users, count, pageInfo };
    },
  },
  Mutation: {
    createUser: async (_parent, args, context) => {
      if (!JwtService.validate(context.token)) {
        throw new ServerError('Invalid token', StatusCodes.Unauthorized);
      }
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
    login: async (_parent, args) => {
      const hashedPassword = crypto.scryptSync(args.input.password, process.env.CRYPTO_SALT, 64).toString();
      const dbUser = await AppDataSource.manager.findOneBy(User, { email: args.input.email });

      if (!dbUser) {
        throw new ServerError('User not found', StatusCodes.NotFound);
      }

      if (dbUser.password !== hashedPassword) {
        throw new ServerError('Password is incorrect', StatusCodes.Unauthorized);
      }

      return { user: dbUser, token: JwtService.sign({ id: dbUser.id }, args.input.rememberMe) };
    },
  },
};
