import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      authProviderId
      authProvider
      email
      name
      preferences {
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
      resumes(limit: 10, offset: 0) {
        id
        originalFilename
        description
        sourceType
        createdAt
        updatedAt
      }
    }
  }
`;
