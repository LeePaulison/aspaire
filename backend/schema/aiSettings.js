export const aiSettingsTypeDefs = /* GraphQL */ `
  enum PromptStyle {
    DEFAULT
    BEHAVIORAL
    CASUAL
    TECHNICAL
  }

  type AISettings {
    id: ID!
    userId: ID!
    promptStyle: String!
    temperature: Float!
    promptInterview: String!
    promptCoverLetter: String!
    promptSearchTerms: String!
    model: String!
    frequencyPenalty: Float!
    presencePenalty: Float!
    maxTokens: Int!
    disabled: Boolean!
    usageNotes: String
    lastUsed: String
    createdAt: String!
    updatedAt: String!
  }

  input AISettingsInput {
    userId: ID!
    promptStyle: String
    temperature: Float
    promptInterview: String
    promptCoverLetter: String
    promptSearchTerms: String
    model: String
    frequencyPenalty: Float
    presencePenalty: Float
    maxTokens: Int
    disabled: Boolean
    usageNotes: String
    lastUsed: String
  }

  extend type Mutation {
    setAISettings(input: AISettingsInput!): AISettings
  }

  extend type Query {
    aiSettings(userId: ID!): AISettings
  }
`;
