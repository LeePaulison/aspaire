import { pool } from '../db/pool.js';

export const setResumeAIResults = async (input) => {
  try {
    const { resumeId, userId, aiSummary, suggestedTitles, suggestedSkills, suggestedIndustries, suggestedLocations } =
      input;

    const result = await pool.query(
      `INSERT INTO resume_ai_results (resume_id, user_id, ai_summary, suggested_titles, suggested_skills, suggested_industries, suggested_locations)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (resume_id) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       ai_summary = EXCLUDED.ai_summary,
       suggested_titles = EXCLUDED.suggested_titles,
       suggested_skills = EXCLUDED.suggested_skills,
       suggested_industries = EXCLUDED.suggested_industries,
       suggested_locations = EXCLUDED.suggested_locations
     RETURNING *`,
      [resumeId, userId, aiSummary, suggestedTitles, suggestedSkills, suggestedIndustries, suggestedLocations]
    );

    const results = result.rows[0];

    return {
      resumeId: results.resume_id,
      userId: results.user_id,
      aiSummary: results.ai_summary,
      suggestedTitles: results.suggested_titles,
      suggestedSkills: results.suggested_skills,
      suggestedIndustries: results.suggested_industries,
      suggestedLocations: results.suggested_locations,
    };
  } catch (error) {
    console.error('Error setting resume AI results:', error);
    throw new Error('Failed to set resume AI results');
  }
};

export const getResumeAIResults = async (resumeId) => {
  const result = await pool.query(`SELECT * FROM resume_ai_results WHERE resume_id = $1`, [resumeId]);

  const row = result.rows[0] ?? null;

  if (!row) {
    return null;
  }

  return {
    resumeId: row.resume_id,
    userId: row.user_id,
    aiSummary: row.ai_summary,
    suggestedTitles: row.suggested_titles,
    suggestedSkills: row.suggested_skills,
    suggestedIndustries: row.suggested_industries,
    suggestedLocations: row.suggested_locations,
  };
};
