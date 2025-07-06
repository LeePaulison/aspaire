export const userTypeDefs = `
  type User {
    id: ID!
    auth_provider_id: String!
    auth_provider: String!
    email: String!
    name: String
    preferences: Preferences
  }

  input CreateUserInput {
    id: ID!
    auth_provider_id: String!
    auth_provider: String!
    email: String!
    name: String
    preferences: PreferencesInput
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
  }

  type Query {
    user(id: ID!): User
  }
`;
