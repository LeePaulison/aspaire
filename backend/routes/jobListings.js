import { fetchRemotiveJobs } from './jobListings/remotive.js';
import { fetchSerpAPIJobs } from './jobListings/serpAPI.js';

async function safeFetch(fetchFn, ...args) {
  try {
    return await fetchFn(...args);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

async function deduplicateJobs(jobs) {
  const seen = new Set();
  const prioritized = [];
  const keyStrategy = (job) => `${job.title.toLowerCase()}-${job.company.toLowerCase()}-${job.location.toLowerCase()}`;

  // Deduplication favors REMOTIVE over SERPAPI for equivalent job postings
  // First pass: keep Remotive jobs
  for (const job of jobs) {
    const key = keyStrategy(job);
    if (job.source === 'REMOTIVE' && !seen.has(key)) {
      seen.add(key);
      prioritized.push(job);
    }
  }

  // Second pass: add only SerpAPI jobs not already seen
  for (const job of jobs) {
    const key = keyStrategy(job);
    if (!seen.has(key)) {
      seen.add(key);
      prioritized.push(job);
    }
  }

  return prioritized;
}

export async function fetchJobs(userId, { search = '', location = '' }) {
  const [remotiveJobs, serpApiJobs] = await Promise.all([
    safeFetch(fetchRemotiveJobs, userId, { search, location }),
    safeFetch(fetchSerpAPIJobs, userId, { search, location }),
  ]);

  console.log(`Fetched ${remotiveJobs.length} Remotive jobs and ${serpApiJobs.length} SerpAPI jobs`);

  const allJobs = [...remotiveJobs, ...serpApiJobs];
  const uniqueJobs = deduplicateJobs(allJobs);

  console.log(`Total unique jobs after deduplication: ${uniqueJobs.length}`);

  return uniqueJobs;
}
