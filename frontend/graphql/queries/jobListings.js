import { gql } from '@apollo/client';

export const JOB_LISTINGS_BY_USER = gql`
  query JobListingsByUser($userId: ID!, $limit: Int = 12, $offset: Int = 0) {
    jobListingsByUser(user_id: $userId, limit: $limit, offset: $offset) {
      id
      title
      company
      location
      job_type
      salary
      publication_date
      source
    }
  }
`;

export const JOB_LISTING = gql`
  query JobListing($id: ID!) {
    jobListing(id: $id) {
      id
      title
      company
      location
      job_type
      salary
      publication_date
      source
      description
      tags
      job_highlights
      raw_payload
    }
  }
`;
