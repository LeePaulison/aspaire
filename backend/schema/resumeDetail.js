export const resumeDetailTypeDefs = /* GraphQL */ `
  type ResumeDetail {
    resume: Resume!
    aiResults: ResumeAIResults!
  }

  extend type Query {
    getResumeDetail(resumeId: ID!): ResumeDetail!
  }
`;
