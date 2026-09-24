import { gql } from '@apollo/client'
import { projectFields } from '@graphql/mutations/projects'

export const CONNECT_GITHUB = gql`
  mutation ConnectGithub($projectId: ID!, $installationId: String!, $repoFullName: String!) {
    connectGithub(
      input: { projectId: $projectId, installationId: $installationId, repoFullName: $repoFullName }
    ) {
      project { ${projectFields} }
    }
  }
`

export const SCAN_CODEBASE = gql`
  mutation ScanCodebase($projectId: ID!) {
    scanCodebase(input: { projectId: $projectId }) {
      success
      message
    }
  }
`

export const CONNECT_CLICK_UP = gql`
  mutation ConnectClickUp($projectId: ID!, $listId: String!) {
    connectClickUp(input: { projectId: $projectId, listId: $listId }) {
      project { ${projectFields} }
    }
  }
`
