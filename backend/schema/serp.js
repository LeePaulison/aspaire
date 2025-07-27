export const serpTypeDefs = /* GraphQL */ `
  type SearchResult {
    title: String
    link: String
    snippet: String
  }

  extend type Query {
    serpSearch(query: String!): [SearchResult!]!
  }
`;
