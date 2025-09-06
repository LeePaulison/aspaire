import { gql } from '@apollo/client';

export const GET_PREFERENCES = gql`
  query GetPreferences($user_id: ID!) {
    preferences(user_id: $user_id) {
      userId
      preferredLocations
      remote
      industries
      salaryMin
      salaryMax
      notificationsEnabled
      paginationLimit
      preferredTitles
      preferredSkills
      salaryCurrency
      createdAt
      updatedAt
    }
  }
`;
