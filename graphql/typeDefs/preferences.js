export const preferencesTypeDefs = `
  type Preferences {
    user_id: ID!
    preferred_locations: [String]
    remote: Boolean
    industries: [String]
    salary_min: Int
    salary_max: Int
    notifications_enabled: Boolean
    created_at: String
    updated_at: String
  }

  input PreferencesInput {
    user_id: ID!
    preferred_locations: [String]
    remote: Boolean
    industries: [String]
    salary_min: Int
    salary_max: Int
    notifications_enabled: Boolean
  }

  type Mutation {
    setPreferences(input: PreferencesInput!): Preferences
  }

  type Query {
    preferences(user_id: ID!): Preferences
  }
`;
