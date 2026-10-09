import { gql } from '@apollo/client'

export const GITHUB_INSTALL_URL = gql`
  query GithubInstallUrl($projectId: ID!) {
    githubInstallUrl(projectId: $projectId)
  }
`

export const GITHUB_AUTHORIZE_URL = gql`
  query GithubAuthorizeUrl($projectId: ID!) {
    githubAuthorizeUrl(projectId: $projectId)
  }
`

export const GITHUB_REPOSITORIES = gql`
  query GithubRepositories($projectId: ID!) {
    githubRepositories(projectId: $projectId)
  }
`
