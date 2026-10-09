import { gql } from '@apollo/client'
import { projectFields } from '@graphql/mutations/projects'

export const COMPLETE_GITHUB_INSTALLATION = gql`
  mutation CompleteGithubInstallation($state: String!, $installationId: String!, $code: String!) {
    completeGithubInstallation(
      input: { state: $state, installationId: $installationId, code: $code }
    ) {
      project { ${projectFields} githubInstalled repoFullName }
    }
  }
`

export const AUTHORIZE_GITHUB_USER = gql`
  mutation AuthorizeGithubUser($state: String!, $code: String!) {
    authorizeGithubUser(input: { state: $state, code: $code }) {
      choiceToken
      installations { id accountLogin accountType }
    }
  }
`

export const SELECT_GITHUB_INSTALLATION = gql`
  mutation SelectGithubInstallation($choiceToken: String!, $installationId: String!) {
    selectGithubInstallation(input: { choiceToken: $choiceToken, installationId: $installationId }) {
      project { ${projectFields} githubInstalled repoFullName }
    }
  }
`

export const CONNECT_GITHUB = gql`
  mutation ConnectGithub($projectId: ID!, $repoFullName: String!) {
    connectGithub(input: { projectId: $projectId, repoFullName: $repoFullName }) {
      project { ${projectFields} githubInstalled repoFullName }
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
