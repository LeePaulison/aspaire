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

  input CreateResumeInput {
    id: ID!
    userId: ID!
    s3Key: String!
    originalFilename: String!
    size: Int!
    contentType: String!
    uploadedAt: String!
  }

  extend type Mutation {
    createResume(input: CreateResumeInput!): Resume
  }

  extend type Query {
    resume(id: ID!): Resume
  }
`;
