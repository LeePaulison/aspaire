import { fetchJobs } from '../routes/jobListings.js';
import { bulkCreateJobListings } from '../dal/jobListings.js';

export async function ingestJobs(_, { userId, filters }) {
  const jobs = await fetchJobs(userId, filters);
  return bulkCreateJobListings(jobs);
}
