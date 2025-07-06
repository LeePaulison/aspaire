import { getDbClient } from '../lib/neon/db';

export async function setPreferences(data) {
  const client = await getDbClient();

  try {
    const query = `
        INSERT INTO preferences (
            user_id,
            preferred_locations,
            remote,
            industries,
            salary_min,
            salary_max,
            notifications_enabled
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id)
        DO UPDATE SET
            preferred_locations = EXCLUDED.preferred_locations,
            remote = EXCLUDED.remote,
            industries = EXCLUDED.industries,
            salary_min = EXCLUDED.salary_min,
            salary_max = EXCLUDED.salary_max,
            notifications_enabled = EXCLUDED.notifications_enabled
        RETURNING *;
      `;

    const values = [
      data.userId,
      data.preferredLocations,
      data.remote,
      data.industries,
      data.salaryMin,
      data.salaryMax,
      data.notificationsEnabled,
    ];

    const result = await client.query(query, values);

    const row = result.rows[0];
    return {
      userId: row.user_id,
      preferredLocations: row.preferred_locations,
      remote: row.remote,
      industries: row.industries,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      notificationsEnabled: row.notifications_enabled,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  } catch (error) {
    console.error('Error setting preferences:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function getPreferencesByUserId(userId) {
  const client = await getDbClient();

  try {
    const query = `
      SELECT * FROM preferences
      WHERE user_id = $1;
    `;

    const result = await client.query(query, [userId]);
    const row = result.rows[0];

    if (!row) return null;

    return {
      userId: row.user_id,
      preferredLocations: row.preferred_locations,
      remote: row.remote,
      industries: row.industries,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      notificationsEnabled: row.notifications_enabled,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  } catch (error) {
    console.error('Error getting preferences:', error);
    throw error;
  } finally {
    await client.end();
  }
}
