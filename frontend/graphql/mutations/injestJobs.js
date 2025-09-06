import { gql } from '@apollo/client';

export const INGEST_JOBS = gql`
  mutation IngestJobs($userId: ID!, $filters: JobFiltersInput!) {
    ingestJobs(userId: $userId, filters: $filters) {
      id
    }
  }
`;
