import { pool } from '../db/pool.js';

export async function setAISettings(data) {
  try {
    const query = `
      INSERT INTO ai_settings (
        user_id,
        prompt_style,
        temperature,
        prompt_interview,
        prompt_cover_letter,
        prompt_search_terms,
        model,
        frequency_penalty,
        presence_penalty,
        max_tokens,
        disabled,
        usage_notes,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        prompt_style = EXCLUDED.prompt_style,
        temperature = EXCLUDED.temperature,
        prompt_interview = EXCLUDED.prompt_interview,
        prompt_cover_letter = EXCLUDED.prompt_cover_letter,
        prompt_search_terms = EXCLUDED.prompt_search_terms,
        model = EXCLUDED.model,
        frequency_penalty = EXCLUDED.frequency_penalty,
        presence_penalty = EXCLUDED.presence_penalty,
        max_tokens = EXCLUDED.max_tokens,
        disabled = EXCLUDED.disabled,
        usage_notes = EXCLUDED.usage_notes,
        updated_at = NOW()
      RETURNING *;
    `;

    const values = [
      data.userId,
      data.promptStyle ?? 'DEFAULT',
      data.temperature ?? 0.7,
      data.promptInterview ?? '',
      data.promptCoverLetter ?? '',
      data.promptSearchTerms ?? '',
      data.model ?? 'gpt-4o',
      data.frequencyPenalty ?? 0.0,
      data.presencePenalty ?? 0.0,
      data.maxTokens ?? 1500,
      data.disabled ?? false,
      data.usageNotes ?? '',
    ];

    console.log('[AI Settings] Executing query:', query);
    console.log('[AI Settings] With values:', values);
    const result = await pool.query(query, values);
    console.log('[AI Settings] Query result:', result.rows);
    const row = result.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      promptStyle: row.prompt_style,
      temperature: row.temperature,
      promptInterview: row.prompt_interview,
      promptCoverLetter: row.prompt_cover_letter,
      promptSearchTerms: row.prompt_search_terms,
      model: row.model,
      frequencyPenalty: row.frequency_penalty,
      presencePenalty: row.presence_penalty,
      maxTokens: row.max_tokens,
      disabled: row.disabled,
      usageNotes: row.usage_notes,
      lastUsed: row.last_used?.toISOString(),
      createdAt: row.created_at?.toISOString(),
      updatedAt: row.updated_at?.toISOString(),
    };
  } catch (error) {
    console.error('Error setting AI settings:', error);
    throw error;
  }
}

export async function getAISettingsByUserId(userId) {
  try {
    const query = `
      SELECT * FROM ai_settings
      WHERE user_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting AI settings by user ID:', error);
    throw error;
  }
}
