// app/api/graphql/route.js

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '../../../graphql/typeDefs/index.js';
import { resolvers } from '../../../graphql/resolvers/index.js';

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Export the Next.js route handler
export const GET = startServerAndCreateNextHandler(server);
export const POST = startServerAndCreateNextHandler(server);
