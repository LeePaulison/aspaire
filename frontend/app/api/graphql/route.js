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

// Create a Next.js route handler for the Apollo Server
// This will handle both GET and POST requests
const handler = startServerAndCreateNextHandler(server);
// Export the Next.js route handler
export const GET = handler;
export const POST = handler;
