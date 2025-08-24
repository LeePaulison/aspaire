export const debugTypeDefs = /* GraphQL */ `
  type UserInfo {
    sub: String
    email: String
    name: String
    tokenIssuedAt: String
    tokenExpiresAt: String
  }

  type DebugContext {
    hasUser: Boolean!
    userInfo: UserInfo
    timestamp: String!
    message: String!
  }

  type AuthFlowDebug {
    steps: [String!]!
    authenticated: Boolean!
    userId: String
  }

  extend type Query {
    debugContext: DebugContext
    debugAuthFlow: AuthFlowDebug
  }
`;
