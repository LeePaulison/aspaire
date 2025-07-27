import { pool } from '../db/pool.js';

export async function createFileResume(resume) {
  try {
    const query = `
      INSERT INTO resumes (
        user_id,
        s3_key,
        original_filename,
        size,
        content_type,
        uploaded_at,
        source_type,
        description,
        partial,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *;
    `;

    const values = [
      resume.userId,
      resume.s3Key,
      resume.originalFilename,
      resume.size,
      resume.contentType,
      resume.uploadedAt,
      resume.sourceType,
      resume.description,
      resume.partial ?? false,
    ];

    const result = await pool.query(query, values);
    const row = result.rows[0];
    return mapResumeRow(row);
  } catch (error) {
    console.error('Error creating file resume:', error);
    throw error;
  }
}

export async function createPastedResume(resume) {
  try {
    const query = `
      INSERT INTO resumes (
        user_id,
        pasted_content,
        source_type,
        description,
        partial,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;

    const values = [resume.userId, resume.pastedContent, resume.sourceType, resume.description, resume.partial ?? true];

    const result = await pool.query(query, values);
    const row = result.rows[0];
    return mapResumeRow(row);
  } catch (error) {
    console.error('Error creating pasted resume:', error);
    throw error;
  }
}

export async function getResumeById(id) {
  console.log('[getResumeById] DB Client:', client);
  console.log('[getResumeById] Fetching resume with ID:', id);

  try {
    const query = `
      SELECT * FROM resumes
      WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];
    if (!row) return null;

    return mapResumeRow(row);
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  }
}

export async function getResumesByUserId(userId, limit = 10, offset = 0) {
  try {
    const query = `
      SELECT * FROM resumes
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;

    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows.map(mapResumeRow);
  } catch (error) {
    console.error('Error getting resumes by user ID:', error);
    throw error;
  }
}

export async function updateResume(id, resume) {
  try {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(resume)) {
      if (value !== undefined) {
        fields.push(`${snakeCase(key)} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields provided for update.');
    }

    const query = `
      UPDATE resumes
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    values.push(id);

    const result = await pool.query(query, values);
    const row = result.rows[0];
    return mapResumeRow(row);
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
}
export async function deleteResume(id) {
  try {
    const query = `
      DELETE FROM resumes
      WHERE id = $1;
    `;
    await pool.query(query, [id]);
    return { success: true, message: 'Resume deleted successfully' };
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
}

// --------------------------------------------
// Helpers
// --------------------------------------------

function mapResumeRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    s3Key: row.s3_key,
    originalFilename: row.original_filename,
    size: row.size,
    contentType: row.content_type,
    uploadedAt: row.uploaded_at ? row.uploaded_at.toISOString() : null,
    createdAt: row.created_at?.toISOString(),
    updatedAt: row.updated_at?.toISOString(),
    description: row.description,
    sourceType: row.source_type,
    partial: row.partial,
    pastedContent: row.pasted_content,
  };
}

function snakeCase(camel) {
  return camel.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
