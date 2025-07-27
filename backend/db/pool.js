import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', async (client) => {
  await client.query('SET search_path TO aspire');
  console.log('Database connection established and search path set to "aspire".');
});
