import { gql } from '@apollo/client'

export const ROLE_CREDENTIALS_FOR_PROJECT = gql`
  query RoleCredentialsForProject($projectId: ID!) {
    roleCredentialsForProject(projectId: $projectId) {
      id
      roleName
      createdAt
      updatedAt
    }
  }
`
