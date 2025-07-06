import { getDbClient } from '../lib/neon/db.js';

export async function createUser(user) {
  const client = await getDbClient();

  console.log('Creating user:', user);

  try {
    const query = `
      INSERT INTO users (id, auth_provider_id, auth_provider, email, name)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id)
      DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [user.id, user.auth_provider_id, user.auth_provider, user.email, user.name];

    console.log('Executing query:', query, 'with values:', values);

    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    await client.end();
  }
}

export async function getUserById(id) {
  const client = await getDbClient();

  try {
    const query = `
      SELECT * FROM users
      WHERE id = $1;
    `;

    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  } finally {
    await client.end();
  }
}
