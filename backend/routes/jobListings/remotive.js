export async function fetchRemotiveJobs(userId, { search = '', location = '' }) {
  const query = new URLSearchParams();
  if (search) {
    query.append('search', search);
  }
  if (location) {
    query.append('location', location);
  }

  const response = await fetch(`https://remotive.com/api/remote-jobs?${query.toString()}`);
  const json = await response.json();
  const jobs = json.jobs || [];

  for (const job of jobs) {
    if (!job.id) {
      console.warn('Job missing ID, generating a unique one');
      job.id = `${job.title}-${job.company}-${job.location}-${Date.now()}`;
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
    source: 'REMOTIVE',
    raw_payload: job,
  }));
}
