export const openAITypeDefs = /* GraphQL */ `
  input ChatMessageInput {
    role: String!
    content: String!
  }

  type ChatMessage {
    role: String!
    content: String!
  }

  type OpenAIChunk {
    content: String
    done: Boolean
  }

  type SuggestedTerms {
    titles: [String]
    skills: [String]
    industries: [String]
    locations: [String]
  }

  extend type Mutation {
    generateCoverLetter(jobDescription: String!, resumeContent: String!): String
    suggestSearchTerms(resume: String!): SuggestedTerms
    resumeSummary(resume: String!): String
    interviewChat(message: String!, history: [ChatMessageInput]!): ChatMessage
  }

  extend type Subscription {
    openAIStream(prompt: String!): OpenAIChunk
    interviewChatStream(message: String!, history: [ChatMessageInput]!): OpenAIChunk
  }
`;
