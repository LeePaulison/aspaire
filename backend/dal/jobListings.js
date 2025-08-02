import { pool } from '../db/pool.js';
import format from 'pg-format';

export async function getJobListing(id) {
  try {
    const query = `
      SELECT * FROM job_listings WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching job listing:', error);
    throw error;
  }
}

export async function getJobListings() {
  try {
    const query = `
      SELECT * FROM job_listings;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching job listings:', error);
    throw error;
  }
}

export async function getJobListingsByUserId(userId) {
  try {
    const query = `
      SELECT * FROM job_listings WHERE user_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching job listings by user ID:', error);
    throw error;
  }
}

export async function getJobListingsBySource(source) {
  try {
    const query = `
      SELECT * FROM job_listings WHERE source = $1;
    `;
    const result = await pool.query(query, [source]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching job listings by source:', error);
    throw error;
  }
}

export async function getJobListingsByExternalId(externalId, source) {
  try {
    const query = `
      SELECT * FROM job_listings WHERE external_id = $1 AND source = $2;
    `;
    const result = await pool.query(query, [externalId, source]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching job listings by external ID:', error);
    throw error;
  }
}

export async function getJobListingsByCompany(company) {
  try {
    const query = `
      SELECT * FROM job_listings WHERE company = $1;
    `;
    const result = await pool.query(query, [company]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching job listings by company:', error);
    throw error;
  }
}

export async function getJobListingsByLocation(location) {
  try {
    const query = `
      SELECT * FROM job_listings WHERE location = $1;
    `;
    const result = await pool.query(query, [location]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching job listings by location:', error);
    throw error;
  }
}

export async function createJobListing(listing) {
  const query = `
    INSERT INTO aspire.job_listings (
      user_id, title, company, company_logo, location, job_type,
      salary, publication_date, description, tags, job_highlights,
      external_id, source, raw_payload
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11,
      $12, $13, $14
    )
    ON CONFLICT (source, external_id) DO UPDATE SET
      salary = EXCLUDED.salary,
      publication_date = EXCLUDED.publication_date,
      description = EXCLUDED.description,
      tags = EXCLUDED.tags,
      job_highlights = EXCLUDED.job_highlights,
      raw_payload = EXCLUDED.raw_payload
    RETURNING *;
  `;

  const values = [
    listing.user_id,
    listing.title,
    listing.company,
    listing.company_logo,
    listing.location,
    listing.job_type,
    listing.salary,
    listing.publication_date,
    listing.description,
    listing.tags,
    listing.job_highlights,
    listing.external_id,
    listing.source,
    listing.raw_payload,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating job listing:', error);
    throw error;
  }
}

export async function bulkCreateJobListings(jobListings) {
  if (!Array.isArray(jobListings) || jobListings.length === 0) {
    return [];
  }

  const columns = [
    'user_id',
    'title',
    'company',
    'company_logo',
    'location',
    'job_type',
    'salary',
    'publication_date',
    'description',
    'tags',
    'job_highlights',
    'external_id',
    'source',
    'raw_payload',
  ];

  // Build the parameter placeholders ($1, $2, ...)
  const valuePlaceholders = jobListings
    .map((_, i) => {
      const base = i * columns.length;
      const placeholders = columns.map((_, j) => `$${base + j + 1}`);
      return `(${placeholders.join(', ')})`;
    })
    .join(', ');

  // Flatten the values array
  const values = jobListings.flatMap((listing) => [
    listing.user_id,
    listing.title,
    listing.company,
    listing.company_logo,
    listing.location,
    listing.job_type,
    listing.salary,
    listing.publication_date,
    listing.description,
    listing.tags,
    listing.job_highlights,
    listing.external_id,
    listing.source,
    listing.raw_payload,
  ]);

  const query = `
    INSERT INTO job_listings (${columns.join(', ')})
    VALUES ${valuePlaceholders}
    ON CONFLICT (source, external_id) DO UPDATE SET
      salary = EXCLUDED.salary,
      publication_date = EXCLUDED.publication_date,
      description = EXCLUDED.description,
      tags = EXCLUDED.tags,
      job_highlights = EXCLUDED.job_highlights,
      raw_payload = EXCLUDED.raw_payload
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows;
}
