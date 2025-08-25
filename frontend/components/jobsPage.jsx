'use client';
import { useSession } from 'next-auth/react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState, useMemo } from 'react';

const JOB_LISTINGS_BY_USER = gql`query($userId: ID!, $limit: Int, $offset: Int){
  jobListingsByUser(user_id: $userId, limit: $limit, offset: $offset) {
    id title company location job_type salary publication_date source
  }
}`;

const INGEST_JOBS = gql`mutation($userId: ID!, $filters: JobFiltersInput!){
  ingestJobs(userId: $userId, filters: $filters) { id }
}`;

export default function JobsPage({ initialUserId = null }) {
  const { data: session, status } = useSession();
  const userId = initialUserId || session?.user?.id || null;

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [formError, setFormError] = useState('');

  const MIN_SEARCH = 3;
  const MIN_LOCATION = 2;
  const canIngest = useMemo(() => {
    const s = (search || '').trim();
    const l = (location || '').trim();
    return s.length >= MIN_SEARCH || l.length >= MIN_LOCATION;
  }, [search, location]);

  // 👉 Skip the query until userId exists
  const { data, loading, error, fetchMore } = useQuery(JOB_LISTINGS_BY_USER, {
    variables: { userId, limit: 12, offset: 0 },
    fetchPolicy: 'cache-and-network',
    skip: !userId,
  });

  // Don’t bind variables here (userId can be null initially)
  const [runIngestion, { loading: ingesting, error: ingestError }] = useMutation(INGEST_JOBS);

  const handleSearch = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!userId) {
      setFormError('Please sign in to search jobs.');
      return;
    }
    if (!canIngest) {
      setFormError(`Add a search (${MIN_SEARCH}+ chars) or a location (${MIN_LOCATION}+ chars).`);
      return;
    }
    await runIngestion({
      variables: { userId, filters: { search, location } },
      refetchQueries: [{ query: JOB_LISTINGS_BY_USER, variables: { userId, limit: 12, offset: 0 } }],
    });
  };

  // Guard UI if not signed in yet
  if (!userId) {
    return (
      <div className="container py-6">
        <h1 className="text-2xl font-semibold">Job Search</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to search and save jobs.</p>
      </div>
    );
  }

  const items = (data?.jobListingsByUser || []).filter(Boolean);

  return (
    <div className="container py-6">
      {/* form omitted for brevity — keep your gated button & errors */}
      {formError && (
        <div className="mb-3 text-sm text-red-600" role="alert" aria-live="polite">
          {formError}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="rounded-xl border p-6 text-sm text-muted-foreground">Loading feed…</div>
      ) : error ? (
        <div className="rounded-xl border p-6 text-sm text-red-600" role="alert">
          {error.message}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border p-6 text-sm text-muted-foreground">
          No jobs yet. Try a broader search or a different location.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {items.map((job) => {
            if (!job?.id) return null; // guard against any null entries
            const posted = job.publication_date
              ? new Date(job.publication_date).toLocaleDateString()
              : '—';
            return (
              <li key={job.id} className="rounded-xl border p-4">
                <h3 className="text-base font-semibold leading-tight">{job.title}</h3>
                <div className="text-sm text-muted-foreground">
                  {job.company} • {job.location || '—'}
                </div>
                <div className="mt-1 text-xs opacity-80">
                  Type: {job.job_type} • Source: {job.source}
                  {job.salary ? <span className="ml-2">• {job.salary}</span> : null}
                </div>
                <div className="mt-1 text-xs opacity-70">Posted: {posted}</div>
              </li>
            );
          })}
        </ul>
      )}

      {items.length > 0 && (
        <div className="pt-2">
          <button
            className="rounded-xl border px-4 py-2 text-sm hover:bg-muted"
            onClick={() =>
              fetchMore({
                variables: { offset: items.length },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    jobListingsByUser: [
                      ...(prev?.jobListingsByUser ?? []),
                      ...(fetchMoreResult?.jobListingsByUser ?? []),
                    ],
                  };
                },
              })
            }
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
