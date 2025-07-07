export const resumeTypeDefs = `
  type Resume {
    id: ID!
    userId: ID!
    s3Key: String!
    originalFilename: String!
    size: Int!
    contentType: String!
    uploadedAt: String!
  }

  type DeleteResult {
    success: Boolean!
    message: String
  }

  input CreateResumeInput {
    userId: ID!
    s3Key: String!
    originalFilename: String!
    size: Int!
    contentType: String!
    uploadedAt: String!
  }

  extend type Mutation {
    createResume(input: CreateResumeInput!): Resume
    updateResume(id: ID!, input: CreateResumeInput!): Resume
    deleteResume(id: ID!): DeleteResult
  }

  extend type Query {
    resume(id: ID!): Resume
    resumesByUser(userId: ID!, limit: Int!, offset: Int!): [Resume!]!
  }
`;
