export const userTypeDefs = /* GraphQL */ `
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
    jobListings(limit: Int = 10, offset: Int = 0): [JobListing]
  }

  input CreateUserInput {
    authProviderId: String!
    authProvider: AuthProvider!
    email: String!
    name: String
    preferences: PreferencesInput
  }

  extend type Mutation {
    createUserWithAuth(input: CreateUserInput!): User
  }

  extend type Query {
    user(id: ID!): User
    userByAuth(authProviderId: String!, authProvider: AuthProvider!, email: String!, name: String): User
  }
`;
