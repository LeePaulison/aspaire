export const resumeTypeDefs = /* GraphQL */ `
  enum ResumeSourceType {
    UPLOAD
    PASTE
    IMPORT
  }

  type Resume {
    id: ID!
    userId: ID!
    s3Key: String
    originalFilename: String
    size: Int
    contentType: String
    uploadedAt: String
    createdAt: String!
    updatedAt: String
    description: String
    sourceType: ResumeSourceType!
    partial: Boolean
    pastedContent: String
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
    sourceType: ResumeSourceType!
    description: String
  }

  input CreatePastedResumeInput {
    userId: ID!
    pastedContent: String!
    sourceType: ResumeSourceType!
    description: String
    createdAt: String
    updatedAt: String
    partial: Boolean
  }

  input UpdateResumeInput {
    description: String
    partial: Boolean
    pastedContent: String
  }

  extend type Mutation {
    createFileResume(input: CreateResumeInput!): Resume
    createPastedResume(input: CreatePastedResumeInput!): Resume
    updateResume(id: ID!, input: UpdateResumeInput!): Resume
    deleteResume(id: ID!): DeleteResult
  }

  extend type Query {
    resume(id: ID!): Resume
    resumesByUser(userId: ID!, limit: Int!, offset: Int!): [Resume!]!
  }
`;
