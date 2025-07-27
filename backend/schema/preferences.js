export const preferencesTypeDefs = /* GraphQL */ `
  type Preferences {
    userId: ID!
    preferredLocations: [String]
    remote: Boolean
    industries: [String]
    salaryMin: Int
    salaryMax: Int
    notificationsEnabled: Boolean
    createdAt: String
    updatedAt: String
    paginationLimit: Int
    preferredTitles: [String]
    preferredSkills: [String]
    salaryCurrency: String
  }

  input PreferencesInput {
    userId: ID!
    preferredLocations: [String]
    remote: Boolean
    industries: [String]
    salaryMin: Int
    salaryMax: Int
    notificationsEnabled: Boolean
    paginationLimit: Int
    preferredTitles: [String]
    preferredSkills: [String]
    salaryCurrency: String
  }

  extend type Mutation {
    setPreferences(input: PreferencesInput!): Preferences
  }

  extend type Query {
    preferences(user_id: ID!): Preferences
  }
`;
