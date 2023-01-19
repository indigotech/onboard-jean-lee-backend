export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    createUser: (parent, args) => ({
      id: 1,
      name: args.input.name,
      email: args.input.email,
      birthDate: args.input.birthDate,
    }),
  },
};
