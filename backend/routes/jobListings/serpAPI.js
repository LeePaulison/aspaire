import { makeFallbackId } from '../../lib/makeFallbackId.js';

export async function fetchSerpAPIJobs(userId, { search = '', location = '' }) {
  if (!process.env.SERP_API_KEY) {
    throw new Error('SERP_API_KEY is not set in environment variables');
  }

  const q = `${search?.trim() || 'Developer'} ${location?.trim() || 'Remote'}`;

  const query = new URLSearchParams({
    engine: 'google_jobs',
    q,
    api_key: process.env.SERP_API_KEY,
  });

  const url = `https://serpapi.com/search.json?${query.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs from SerpAPI: ${response.statusText}`);
  }

  const json = await response.json();
  const jobs = json.jobs_results || json.jobs || [];
  if (!jobs.length) {
    return [];
  }

  if (!Array.isArray(jobs)) {
    throw new Error('Invalid response format from SerpAPI');
  }

  for (const job of jobs) {
    if (!job.id) {
      job.id = makeFallbackId(job);
    }
  }

  return jobs.map((job) => ({
    user_id: userId,
    title: job.title || 'Unknown Title',
    company: job.company_name || job.company || 'Unknown Company',
    company_logo: job.company_logo || null,
    location: job.location || 'Unspecified',
    job_type: job.job_type || 'N/A',
    salary: job.salary || '',
    publication_date: job.publication_date || new Date().toISOString(),
    description: job.description || '',
    tags: job.tags || [],
    job_highlights: job.job_highlights || [],
    external_id: job.id.toString(),
    source: 'SERPAPI',
    raw_payload: job,
  }));
}
