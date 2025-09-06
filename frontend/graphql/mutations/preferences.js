import { gql } from '@apollo/client';

export const SET_PREFERENCES = gql`
  mutation SetPreferences($input: PreferencesInput!) {
    setPreferences(input: $input) {
      userId
      preferredLocations
      remote
      paginationLimit
      preferredTitles
      preferredSkills
      updatedAt
    }
  }
`;
