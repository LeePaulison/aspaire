// backend/server.js
import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { createRequire } from 'module';
import dotenv from 'dotenv';
dotenv.config();
import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';

const require = createRequire(import.meta.url);
const { useServer } = require('graphql-ws/use/ws');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
}
const schema = createSchema({ typeDefs, resolvers });

function getUserFromRequest(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '');
  try {
    return token ? jwt.verify(token, JWT_SECRET) : null;
  } catch {
    return null;
  }
}

const yoga = createYoga({
  schema,
  context: ({ request }) => ({ user: getUserFromRequest(request) }),
  graphqlEndpoint: '/graphql',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
});

const server = createServer(yoga);

const wsServer = new WebSocketServer({
  server,
  path: '/graphql',
});

// eslint-disable-next-line react-hooks/rules-of-hooks
useServer({ schema }, wsServer);

server.listen(4000, () => {
  console.log('🚀 Yoga GraphQL running at http://localhost:4000/graphql');
});
