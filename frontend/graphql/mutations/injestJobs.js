import { gql } from '@apollo/client';

export const INJECT_JOBS = gql`
  mutation IngestJobs($userId: ID!, $filters: JobFiltersInput!) {
    ingestJobs(userId: $userId, filters: $filters) {
      id
      title
      company
      location
      job_type
      salary
      publication_date
      tags
      job_highlights
      source
      external_id
    }
  }
`;
