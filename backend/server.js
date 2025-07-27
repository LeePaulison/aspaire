// backend/server.js
import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '../.env');
dotenv.config({ path: envPath });

import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';
import { routeOpenAI } from './routes/openai.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
console.log('JWT Secret:', JWT_SECRET ? 'Loaded' : 'Not Loaded');
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Not Loaded');
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

// const server = createServer(yoga);
const server = createServer(async (req, res) => {
  if (req.url?.startsWith('/openai')) {
    return await routeOpenAI(req, res);
  }

  return yoga(req, res);
});

const wsServer = new WebSocketServer({
  server,
  path: '/graphql',
});

// eslint-disable-next-line react-hooks/rules-of-hooks
useServer({ schema }, wsServer);

server.listen(4000, () => {
  console.log('🚀 Yoga GraphQL running at http://localhost:4000/graphql');
});
