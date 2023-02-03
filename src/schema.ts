import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    birthDate: String!
  }

  type Query {
    hello: String
    user(id: Int!): User
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
    rememberMe: Boolean
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
