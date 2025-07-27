import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'pg';

export async function getDbClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('Connecting to database...');
  console.log('Database URL:', process.env.DATABASE_URL);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  // Set default schema
  await client.query('SET search_path TO aspire;');

  return client;
}
