import { gql } from '@apollo/client';

export const SET_PREFERENCES = gql`
  mutation SetPreferences($input: PreferencesInput!) {
    setPreferences(input: $input) {
      userId
      preferredLocations
      preferredTitles
      preferredSkills
      industries
      remote
      salaryMin
      salaryMax
      salaryCurrency
      notificationsEnabled
      paginationLimit
      createdAt
      updatedAt
    }
  }
`;
