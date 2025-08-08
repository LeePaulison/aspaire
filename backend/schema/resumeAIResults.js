export const resumeAIResultsTypeDefs = /* GraphQL */ `
  type ResumeAIResults {
    resumeId: ID!
    userId: ID!
    aiSummary: String
    suggestedTitles: [String]
    suggestedSkills: [String]
    suggestedIndustries: [String]
    suggestedLocations: [String]
    createdAt: String
    updatedAt: String
  }

  input ResumeAIResultsInput {
    resumeId: ID!
    userId: ID!
    aiSummary: String
    suggestedTitles: [String]
    suggestedSkills: [String]
    suggestedIndustries: [String]
    suggestedLocations: [String]
  }

  extend type Mutation {
    setResumeAIResults(input: ResumeAIResultsInput!): ResumeAIResults!
  }

  extend type Query {
    getResumeAIResults(resumeId: ID!): ResumeAIResults!
  }
`;
