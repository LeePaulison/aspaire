export const userTypeDefs = `
enum AuthProvider {
  GITHUB
  GOOGLE
}

  type User {
    id: ID!
    authProviderId: String!
    authProvider: AuthProvider!
    email: String!
    name: String
    preferences: Preferences
    resumes(limit: Int!, offset: Int!): [Resume]
  }

  input CreateUserInput {
    id: ID!
    authProviderId: String!
    authProvider: AuthProvider!
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
