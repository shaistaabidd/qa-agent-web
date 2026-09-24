import { gql } from '@apollo/client'

export const SET_ROLE_CREDENTIAL = gql`
  mutation SetRoleCredential($projectId: ID!, $roleName: String!, $credentialValue: String!) {
    setRoleCredential(
      input: { projectId: $projectId, roleName: $roleName, credentialValue: $credentialValue }
    ) {
      roleCredential { id roleName createdAt updatedAt }
    }
  }
`
