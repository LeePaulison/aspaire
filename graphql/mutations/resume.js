import { gql } from '@apollo/client';

export const CREATE_FILE_RESUME = gql`
  mutation CreateFileResume($input: CreateResumeInput!) {
    createFileResume(input: $input) {
      id
      description
      sourceType
      createdAt
    }
  }
`;

export const CREATE_PASTED_RESUME = gql`
  mutation CreatePastedResume($input: CreatePastedResumeInput!) {
    createPastedResume(input: $input) {
      id
      description
      pastedContent
      createdAt
    }
  }
`;
