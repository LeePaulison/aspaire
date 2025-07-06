import { getDbClient } from '../lib/neon/db';

export async function setPreferences(preferences) {
  const client = await getDbClient();

  try {
    const query = `
      INSERT INTO preferences (
        user_id, preferred_locations, remote, industries, salary_min, salary_max, notifications_enabled
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id)
      DO UPDATE SET
        preferred_locations = EXCLUDED.preferred_locations,
        remote = EXCLUDED.remote,
        industries = EXCLUDED.industries,
        salary_min = EXCLUDED.salary_min,
        salary_max = EXCLUDED.salary_max,
        notifications_enabled = EXCLUDED.notifications_enabled,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      preferences.userId,
      preferences.preferredLocations,
      preferences.remote,
      preferences.industries,
      preferences.salaryMin,
      preferences.salaryMax,
      preferences.notificationsEnabled,
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    await client.end();
  }
}

export async function getPreferencesByUserId(user_id) {
  const client = await getDbClient();

  try {
    const query = `
      SELECT * FROM preferences
      WHERE user_id = $1;
    `;

    const result = await client.query(query, [user_id]);
    return result.rows[0] || null;
  } finally {
    await client.end();
  }
}
