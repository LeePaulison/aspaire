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

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
  throw new Error('MONGODB_URI or DATABASE_URL environment variable is required');
}
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  context: ({ request }) => {
    const user = getUserFromRequest(request);
    return { user };
  },
  graphqlEndpoint: '/graphql',
  cors: {
    origin: process.env.NODE_ENV === 'production' ? [
      // Production domains - specify exact URLs
      'https://aspaire.vercel.app',
      'https://aspaire-frontend.vercel.app',
      // Add other specific production domains here
    ] : [
      // Development domains
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:4000',
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
    // Add plugins here as needed
  ],
  formatError: (err) => {
    // Log full error details server-side for debugging
    console.error('[GraphQL] Error occurred:', err.message);
    if (process.env.NODE_ENV !== 'production') {
      console.error('[GraphQL] Error stack:', err.stack);
      console.error('[GraphQL] Error locations:', err.locations);
      console.error('[GraphQL] Error path:', err.path);
    }
    
    // Return limited error information to client
    if (process.env.NODE_ENV === 'production') {
      return {
        message: 'An error occurred while processing your request',
        // Only include locations and path in development
      };
    }
    
    return {
      message: err.message,
      locations: err.locations,
      path: err.path
    };
  }
});

// const server = createServer(yoga);
const server = createServer(async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Server] ${req.method} ${req.url}`);
  }
  
  // Set CORS headers on ALL responses
  const allowedOrigins = process.env.NODE_ENV === 'production' ? [
    'https://aspaire.vercel.app',
    'https://aspaire-frontend.vercel.app'
  ] : [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:4000'
  ];
  
  const setCorsHeaders = () => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  };

  setCorsHeaders();

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400');
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url?.startsWith('/openai')) {
    return await routeOpenAI(req, res);
  }
  
  try {
    const result = await yoga(req, res);
    return result;
  } catch (error) {
    console.error('[Server] GraphQL Yoga error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : error.message;
    res.end(JSON.stringify({ error: 'Internal Server Error', message: errorMessage }));
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
