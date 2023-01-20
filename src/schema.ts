export const typeDefs = `#graphql
type Query {
  hello: String
}

type User {
  id: Int!
  name: String!
  email: String!
  birthDate: String!
}

input UserInput {
  name: String!
  email: String!
  password: String!
  birthDate: String!
}

input LoginInput {
  email: String!
  password: String!
}

type LoginResponse {
  user: User!
  token: String!
}

type Mutation {
  createUser(input: UserInput!): User
  login(input: LoginInput!): LoginResponse
}
`;
