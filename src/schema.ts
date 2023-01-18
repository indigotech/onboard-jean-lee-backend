export const typeDefs = `#graphql
type Query {
  hello: String
}

input UserInput {
  name: String!
  email: String!
  password: String!
  birthDate: String!
}

type User {
  id: String!
  name: String!
  email: String!
  birthDate: String!
}

type Mutation {
  createUser(input: UserInput!): User
}
`;
