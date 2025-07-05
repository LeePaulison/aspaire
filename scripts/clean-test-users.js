import { getDbClient } from '../lib/neon/db.js';

async function cleanTestUsers() {
  const client = await getDbClient();

  // Delete test users
  await client.query(`DELETE FROM users WHERE email = $1;`, ['example@example.com']);

  await client.end();
}

cleanTestUsers().catch(console.error);
