import { pool } from '../db/pool.js';

export async function setPreferences(data) {
  try {
    const query = `
        INSERT INTO preferences (
            user_id,
            preferred_locations,
            remote,
            industries,
            salary_min,
            salary_max,
            notifications_enabled,
            pagination_limit,
            preferred_titles,
            preferred_skills,
            salary_currency
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (user_id)
        DO UPDATE SET
            preferred_locations = EXCLUDED.preferred_locations,
            remote = EXCLUDED.remote,
            industries = EXCLUDED.industries,
            salary_min = EXCLUDED.salary_min,
            salary_max = EXCLUDED.salary_max,
            notifications_enabled = EXCLUDED.notifications_enabled,
            pagination_limit = EXCLUDED.pagination_limit,
            preferred_titles = EXCLUDED.preferred_titles,
            preferred_skills = EXCLUDED.preferred_skills,
            salary_currency = EXCLUDED.salary_currency
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
      data.paginationLimit,
      data.preferredTitles,
      data.preferredSkills,
      data.salaryCurrency,
    ];

    const result = await pool.query(query, values);

    const row = result.rows[0];
    return {
      userId: row.user_id,
      preferredLocations: row.preferred_locations,
      remote: row.remote,
      industries: row.industries,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      notificationsEnabled: row.notifications_enabled,
      paginationLimit: row.pagination_limit,
      preferredTitles: row.preferred_titles,
      preferredSkills: row.preferred_skills,
      salaryCurrency: row.salary_currency,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  } catch (error) {
    console.error('Error setting preferences:', error);
    throw error;
  }
}

export async function getPreferencesByUserId(userId) {
  try {
    const query = `
      SELECT * FROM preferences
      WHERE user_id = $1;
    `;

    const result = await pool.query(query, [userId]);
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
      paginationLimit: row.pagination_limit,
      preferredTitles: row.preferred_titles,
      preferredSkills: row.preferred_skills,
      salaryCurrency: row.salary_currency,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  } catch (error) {
    console.error('Error getting preferences:', error);
    throw error;
  }
}
