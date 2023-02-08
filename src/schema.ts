import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    page: Int!
    offset: Int!
    limit: Int!
    totalPages: Int!
  }

  type Address {
    id: Int!
    street: String!
    streetNumber: Int!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
    cep: String!
  }

  type User {
    id: Int!
    name: String!
    email: String!
    birthDate: String!
    address: [Address]
  }

  type PaginatedUsers {
    users: [User!]!
    count: Int!
    pageInfo: PageInfo!
  }

  input UsersInput {
    limit: Int = 10
    page: Int = 1
  }

  type Query {
    hello: String
    user(id: Int!): User
    users(input: UsersInput): PaginatedUsers
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
