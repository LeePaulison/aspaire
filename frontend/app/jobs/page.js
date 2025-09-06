'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { shallow } from 'zustand/shallow';
import { useUserStore } from '@/store/userStore';
import { JobDetailsView } from './jobDetailsView';
import { INGEST_JOBS } from '@/graphql/mutations/injestJobs';
import { JOB_LISTINGS_BY_USER, JOB_LISTING } from '@/graphql/queries/jobListings';
import { formatDate } from '@/lib/parseDateTime';

/**
 * Jobs Page
 * - Dedicated route for search + results (keeps dashboard lean)
 * - Integrates the `ingestJobs` mutation which calls SerpAPI + Remotive and persists to job_listings
 * - Reads with `jobListingsByUser` (paginated)
 * - Details panel fetches full description/highlights on demand
 *
 * NOTE: Replace `demoUserId` with your actual auth user id.
 */

export default function JobsPage() {
  const user = useUserStore((s) => s.user, shallow);
  console.log(user);

  // URL-ish state for the search form (kept local here; hydrate from router if you prefer)
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  // Kick off ingestion
  const [runIngestion, { loading: ingesting, error: ingestError }] = useMutation(INGEST_JOBS, {
    variables: { userId: user?.id, filters: { search, location } },
    refetchQueries: [{ query: JOB_LISTINGS_BY_USER, variables: { userId: user?.id, limit: 12, offset: 0 } }],
    skip: !user?.id, // Skip mutation if user is not available
  });

  // Feed query
  const { data, loading, error, fetchMore } = useQuery(JOB_LISTINGS_BY_USER, {
    variables: { userId: user?.id, limit: 12, offset: 0 },
    fetchPolicy: 'cache-and-network',
    skip: !user?.id, // Skip query if user is not available
  });

  const items = data?.jobListingsByUser ?? [];

  // Details modal (lazy fetch)
  const [selectedId, setSelectedId] = useState(null);
  const [loadJob, { data: jobDetail, loading: loadingDetail }] = useLazyQuery(JOB_LISTING);

  const openDetails = (id) => {
    setSelectedId(id);
    loadJob({ variables: { id } });
  };

  const closeDetails = () => setSelectedId(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    await runIngestion();
  };

  // Show loading state while user is being loaded
  if (!user) {
    return (
      <div className='container py-6'>
        <div className='rounded-xl border p-6 text-sm text-muted-foreground'>Loading user data...</div>
      </div>
    );
  }

  return (
    <div className='container py-6'>
      <header className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Job Search</h1>
          <p className='text-sm text-muted-foreground'>Pull fresh roles via SerpAPI + Remotive, saved to your feed.</p>
        </div>
      </header>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className='mb-5 grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 sm:grid-cols-12'
      >
        <div className='sm:col-span-6'>
          <label className='mb-1 block text-sm font-medium'>Search terms</label>
          <input
            className='w-full rounded-lg border px-3 py-2'
            placeholder='e.g. frontend engineer OR react developer'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='sm:col-span-4'>
          <label className='mb-1 block text-sm font-medium'>Location</label>
          <input
            className='w-full rounded-lg border px-3 py-2'
            placeholder='e.g. remote OR orlando'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className='sm:col-span-2 flex items-end'>
          <button
            type='submit'
            disabled={ingesting || user == null || search.trim() === ''}
            className='inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-primary-foreground shadow-sm transition hover:opacity-95 disabled:opacity-60'
          >
            {ingesting ? 'Searching…' : 'Find New Jobs'}
          </button>
        </div>
        {ingestError && (
          <div className='sm:col-span-12 text-sm text-red-600' role='alert'>
            {ingestError.message}
          </div>
        )}
      </form>

      {/* Results */}
      <section aria-live='polite' className='space-y-3'>
        {loading && items.length === 0 ? (
          <div className='rounded-xl border p-6 text-sm text-muted-foreground'>Loading feed…</div>
        ) : error ? (
          <div className='rounded-xl border p-6 text-sm text-red-600' role='alert'>
            {error.message}
          </div>
        ) : items.length === 0 ? (
          <div className='rounded-xl border p-6 text-sm text-muted-foreground'>
            No jobs yet. Try a broader search or a different location.
          </div>
        ) : (
          <ul className='grid grid-cols-1 gap-3'>
            {items.map((job, idx) => (
              <li key={`${job.id}-${job.source}-${idx}`} className='rounded-xl border p-4'>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <h3 className='text-base font-semibold leading-tight'>{job.title}</h3>
                    <div className='text-sm text-muted-foreground'>
                      {job.company} • {job.location || '—'}
                    </div>
                    <div className='mt-1 text-xs opacity-80'>
                      Type: {job.job_type} • Source: {job.source}
                      {job.salary ? <span className='ml-2'>• {job.salary}</span> : null}
                    </div>
                    <div className='mt-1 text-xs opacity-70'>
                      {console.log('job.publication_date', formatDate(job.publication_date))}
                      Posted: {formatDate(job.publication_date)}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => openDetails(job.id)}
                      className='rounded-lg border border-accent px-3 py-1.5 text-sm hover:bg-muted'
                    >
                      Details
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Load more */}
        {items.length > 0 && (
          <div className='pt-2'>
            <button
              className='rounded-xl border px-4 py-2 text-sm hover:bg-muted'
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
      </section>

      {/* Details Modal */}
      {selectedId && (
        <div className='fixed inset-0 z-50 grid place-items-center bg-black/50 p-4' onClick={closeDetails}>
          <div
            className='max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl border bg-card p-5 shadow-xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-3 flex items-start justify-between gap-3'>
              <h2 className='text-lg font-semibold'>Job details</h2>
              <button onClick={closeDetails} className='rounded-lg border px-3 py-1 text-sm hover:bg-muted'>
                Close
              </button>
            </div>

            {loadingDetail ? (
              <div className='text-sm text-muted-foreground'>Loading…</div>
            ) : jobDetail?.jobListing ? (
              <JobDetailsView job={jobDetail.jobListing} />
            ) : (
              <div className='text-sm text-red-600'>Failed to load job details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
