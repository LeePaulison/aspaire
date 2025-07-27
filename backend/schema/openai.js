export const openAITypeDefs = /* GraphQL */ `
  type OpenAIChunk {
    content: String
    done: Boolean
  }

  extend type Subscription {
    openAIStream(prompt: String!): OpenAIChunk
  }
`;
