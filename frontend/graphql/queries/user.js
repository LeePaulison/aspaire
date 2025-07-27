import { gql } from '@apollo/client';

export const GET_USER_BY_AUTH = gql`
  query GetUserByAuth($authProvider: AuthProvider!, $authProviderId: String!, $email: String!, $name: String) {
    userByAuth(authProvider: $authProvider, authProviderId: $authProviderId, email: $email, name: $name) {
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

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
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
