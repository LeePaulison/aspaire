import { pool } from '../db/pool.js';

export async function createUserWithAuth(userInput) {
  try {
    const query = `
      INSERT INTO users (auth_provider_id, auth_provider, email, name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (auth_provider_id, auth_provider)
      DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [userInput.authProviderId, userInput.authProvider, userInput.email, userInput.name];

    const result = await pool.query(query, values);

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
    console.error('Error creating user with auth:', error);
    throw error;
  }
}

export async function getUserByAuth(authProviderId, authProvider, email, name) {
  try {
    const query = `
      SELECT * FROM users
      WHERE auth_provider_id = $1 AND auth_provider = $2 AND email = $3 AND name = $4;
    `;
    const result = await pool.query(query, [authProviderId, authProvider, email, name]);
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
    console.error('Error getting user by auth:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const query = `
      SELECT * FROM users
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
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
  }
}
