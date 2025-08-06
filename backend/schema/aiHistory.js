export const aiHistoryTypeDefs = /* GraphQL */ `
  scalar JSON

  type AIHistory {
    id: ID
    conversationId: String!
    userId: ID!
    type: String!
    title: String!
    input: JSON
    output: JSON
    createdAt: String
  }

  input SaveAIHistoryInput {
    conversationId: String!
    userId: ID!
    type: String!
    title: String!
    input: JSON
    output: JSON
  }

  extend type Query {
    aiHistory(userId: ID!, type: String): [AIHistory]
  }

  extend type Mutation {
    saveAIHistory(input: SaveAIHistoryInput!): ID
  }
`;
