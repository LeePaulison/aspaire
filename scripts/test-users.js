import { getDbClient } from '../lib/neon/db.js';

async function testConnection() {
  const client = await getDbClient();

  // Insert a user for testing
  const insertRes = await client.query(
    `INSERT INTO users (auth_provider_id, auth_provider, email, name)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    ['12345', 'github', 'example@example.com', 'Test User']
  );
  console.log('Inserted User:', insertRes.rows[0]);

  // Read all users
  const res = await client.query('SELECT * FROM users;');
  console.log('All Users:', res.rows);

  await client.end();
}

testConnection().catch(console.error);
