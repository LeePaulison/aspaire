import { getDbClient } from '@/lib/neon/db';

export async function createResume(resume) {
  const client = await getDbClient();

  try {
    const query = `
      INSERT INTO resumes (
        user_id,
        s3_key,
        original_filename,
        size,
        content_type,
        uploaded_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      resume.userId,
      resume.s3Key,
      resume.originalFilename,
      resume.size,
      resume.contentType,
      resume.uploadedAt,
    ];

    const result = await client.query(query, values);
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      s3Key: row.s3_key,
      originalFilename: row.original_filename,
      size: row.size,
      contentType: row.content_type,
      uploadedAt: row.uploaded_at,
    };
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function getResumeById(id) {
  const client = await getDbClient();

  try {
    const query = `
      SELECT * FROM resumes
      WHERE id = $1;
    `;
    const result = await client.query(query, [id]);
    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      s3Key: row.s3_key,
      originalFilename: row.original_filename,
      size: row.size,
      contentType: row.content_type,
      uploadedAt: row.uploaded_at,
    };
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function getResumesByUserId(userId, limit = 10, offset = 0) {
  const client = await getDbClient();

  try {
    const query = `
      SELECT * FROM resumes
      WHERE user_id = $1
      LIMIT $2 OFFSET $3;
    `;
    const result = await client.query(query, [userId, limit, offset]);
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      s3Key: row.s3_key,
      originalFilename: row.original_filename,
      size: row.size,
      contentType: row.content_type,
      uploadedAt: row.uploaded_at.toISOString(),
    }));
  } catch (error) {
    console.error('Error getting resumes by user ID:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function updateResume(id, resume) {
  const client = await getDbClient();

  try {
    const query = `
      UPDATE resumes
      SET
        user_id = $1,
        s3_key = $2,
        original_filename = $3,
        size = $4,
        content_type = $5,
        uploaded_at = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      resume.userId,
      resume.s3Key,
      resume.originalFilename,
      resume.size,
      resume.contentType,
      resume.uploadedAt,
      id,
    ];
    const result = await client.query(query, values);
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      s3Key: row.s3_key,
      originalFilename: row.original_filename,
      size: row.size,
      contentType: row.content_type,
      uploadedAt: row.uploaded_at.toISOString(),
    };
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function deleteResume(id) {
  const client = await getDbClient();

  try {
    const query = `
      DELETE FROM resumes
      WHERE id = $1;
    `;
    await client.query(query, [id]);
    return { success: true, message: 'Resume deleted successfully' };
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  } finally {
    await client.end();
  }
}
