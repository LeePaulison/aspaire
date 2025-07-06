export const userTypeDefs = `
  type User {
    id: ID!
    auth_provider_id: String!
    auth_provider: String!
    email: String!
    name: String
  }

  input CreateUserInput {
    id: ID!
    auth_provider_id: String!
    auth_provider: String!
    email: String!
    name: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
  }

  type Query {
    hello: String
    user(id: ID!): User
  }
`;
