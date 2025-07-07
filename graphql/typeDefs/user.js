export const userTypeDefs = `
  type User {
    id: ID!
    authProviderId: String!
    authProvider: String!
    email: String!
    name: String
    preferences: Preferences
    resumes(limit: Int!, offset: Int!): [Resume]
  }

  input CreateUserInput {
    id: ID!
    authProviderId: String!
    authProvider: String!
    email: String!
    name: String
    preferences: PreferencesInput
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User
  }

  extend type Query {
    user(id: ID!): User
  }
`;
