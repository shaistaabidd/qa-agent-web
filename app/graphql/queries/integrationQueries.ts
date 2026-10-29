import { gql } from '@apollo/client';

export const FETCH_GITHUB_INSTALL_URL = gql`
  query FetchGithubInstallUrl($projectId: ID!) {
    fetchGithubInstallUrl(projectId: $projectId)
  }
`;

export const FETCH_GITHUB_AUTHORIZE_URL = gql`
  query FetchGithubAuthorizeUrl($projectId: ID!) {
    fetchGithubAuthorizeUrl(projectId: $projectId)
  }
`;

export const ALL_GITHUB_REPOSITORIES = gql`
  query AllGithubRepositories($projectId: ID!) {
    allGithubRepositories(projectId: $projectId)
  }
`;
