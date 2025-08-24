// backend/server.js
import { createServer } from 'http';
import { createYoga, createSchema } from 'graphql-yoga';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Starting server...');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';
import { routeOpenAI } from './routes/openai.js';
import { getUserFromRequest } from './middleware/auth.js';

console.log('Environment Variables Loaded - MongoDB URI:', process.env.MONGODB_URI ? 'Loaded' : 'Not Loaded');
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Loaded' : 'Not Loaded');
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Not Loaded');

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  context: ({ request }) => {
    console.log('[GraphQL] Creating context for request');
    const user = getUserFromRequest(request);
    console.log('[GraphQL] Context user:', user ? 'authenticated' : 'not authenticated');
    return { user };
  },
  graphqlEndpoint: '/graphql',
  cors: {
    origin: [
      // Local development
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:4000',
      // Production domains - common hosting providers
      'https://aspaire.vercel.app',
      'https://aspaire-frontend.vercel.app',
      /\.vercel\.app$/,
      /\.netlify\.app$/,
      /\.fly\.dev$/,
      // Add your specific frontend domain here if different
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    optionsSuccessStatus: 200
  },
  plugins: [
    {
      onRequest: ({ request, serverContext }) => {
        console.log('[GraphQL] Request received:', request.url);
      },
      onResponse: ({ request, response }) => {
        console.log('[GraphQL] Response status:', response.status);
      }
    }
  ],
  formatError: (err) => {
    console.error('[GraphQL] Error occurred:', err.message);
    console.error('[GraphQL] Error stack:', err.stack);
    console.error('[GraphQL] Error locations:', err.locations);
    console.error('[GraphQL] Error path:', err.path);
    return {
      message: err.message,
      locations: err.locations,
      path: err.path
    };
  }
});

// const server = createServer(yoga);
const server = createServer(async (req, res) => {
  console.log(`[Server] ${req.method} ${req.url}`);
  
  // Set CORS headers on ALL responses
  const setCorsHeaders = () => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  };

  setCorsHeaders();

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log('[Server] Handling OPTIONS preflight request');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url?.startsWith('/openai')) {
    console.log('[Server] Routing to OpenAI handler');
    return await routeOpenAI(req, res);
  }

  console.log('[Server] Routing to GraphQL Yoga');
  
  try {
    const result = await yoga(req, res);
    console.log('[Server] GraphQL Yoga handled request successfully');
    return result;
  } catch (error) {
    console.error('[Server] GraphQL Yoga error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
  }
});

const wsServer = new WebSocketServer({
  server,
  path: '/graphql',
});

// eslint-disable-next-line react-hooks/rules-of-hooks
useServer({ schema }, wsServer);
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Yoga GraphQL running at http://0.0.0.0:${PORT}/graphql`);
});
