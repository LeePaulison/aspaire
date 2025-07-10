import { getDbClient } from '../lib/neon/db.js';

// This file contains functions to interact with the users table in the database.

export async function createUser(user) {
  const client = await getDbClient();

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

    const values = [user.id, user.authProviderId, user.authProvider, user.email, user.name];

    const result = await client.query(query, values);

    const row = result.rows[0];

    if (!row) return null;

    return {
      id: row.id,
      authProviderId: row.auth_provider_id,
      authProvider: row.auth_provider,
      email: row.email,
      name: row.name,
    };
  } finally {
    await client.end();
  }
}

export async function getUserByAuth(authProviderId, authProvider) {
  const client = await getDbClient();

  try {
    const query = `
      SELECT * FROM users
      WHERE auth_provider_id = $1 AND auth_provider = $2;
    `;
    const result = await client.query(query, [authProviderId, authProvider]);
    const row = result.rows[0];

    if (!row) return null;

    return {
      id: row.id,
      authProviderId: row.auth_provider_id,
      authProvider: row.auth_provider,
      email: row.email,
      name: row.name,
    };
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
    const row = result.rows[0];

    if (!row) return null;

    return {
      id: row.id,
      authProviderId: row.auth_provider_id,
      authProvider: row.auth_provider,
      email: row.email,
      name: row.name,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  } finally {
    await client.end();
  }
}
