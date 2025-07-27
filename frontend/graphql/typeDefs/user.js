export const userTypeDefs = `
enum AuthProvider {
  GITHUB
  GOOGLE
}

  extend type User {
    id: ID!
    authProviderId: String!
    authProvider: AuthProvider!
    email: String!
    name: String
    preferences: Preferences
    resumes(limit: Int = 10, offset: Int = 0): [Resume]
  }

  input CreateUserInput {
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
    userByAuth(authProviderId: String!, authProvider: AuthProvider!, email: String!, name: String): User
  }
`;
