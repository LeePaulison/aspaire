import { getDbClient } from '@/lib/neon/db';

export async function createResume(data) {
  const client = await getDbClient();

  try {
    const query = `
      INSERT INTO resumes (
        id,
        user_id,
        s3_key,
        original_filename,
        size,
        content_type,
        uploaded_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      data.id,
      data.userId,
      data.s3Key,
      data.originalFilename,
      data.size,
      data.contentType,
      data.uploadedAt,
    ];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function getResume(id) {
  const client = await getDbClient();

  try {
    const query = `
      SELECT * FROM resumes
      WHERE id = $1;
    `;
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function updateResume(id, data) {
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
    const values = [data.userId, data.s3Key, data.originalFilename, data.size, data.contentType, data.uploadedAt, id];
    const result = await client.query(query, values);
    return result.rows[0];
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
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  } finally {
    await client.end();
  }
}
