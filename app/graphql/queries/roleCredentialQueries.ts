import { gql } from '@apollo/client';

export const ALL_ROLE_CREDENTIALS = gql`
  query AllRoleCredentials($projectId: ID!) {
    allRoleCredentials(projectId: $projectId) {
      createdAt
      id
      roleName
      updatedAt
    }
  }
`;
