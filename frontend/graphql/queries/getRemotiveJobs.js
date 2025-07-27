import { gql } from '@apollo/client';

export const GET_REMOTIVE_JOBS = gql`
  query GetRemotiveJobs {
    remotiveJobs {
      id
      title
      company_name
      salary
      candidate_required_location
    }
  }
`;
