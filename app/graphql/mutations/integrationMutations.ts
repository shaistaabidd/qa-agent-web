import { gql } from '@apollo/client';

import { projectFields } from '../fragments';

export const CONNECT_GITHUB = gql`
  mutation ConnectGithub($input: ConnectGithubInput!) {
    connectGithub(input: $input) {
      project {
        ${projectFields}
      }
    }
  }
`;

export const COMPLETE_GITHUB_INSTALLATION = gql`
  mutation CompleteGithubInstallation($input: CompleteGithubInstallationInput!) {
    completeGithubInstallation(input: $input) {
      project {
        ${projectFields}
      }
    }
  }
`;

export const AUTHORIZE_GITHUB_USER = gql`
  mutation AuthorizeGithubUser($input: AuthorizeGithubUserInput!) {
    authorizeGithubUser(input: $input) {
      choiceToken
      installations {
        accountLogin
        accountType
        id
      }
    }
  }
`;

export const SELECT_GITHUB_INSTALLATION = gql`
  mutation SelectGithubInstallation($input: SelectGithubInstallationInput!) {
    selectGithubInstallation(input: $input) {
      project {
        ${projectFields}
      }
    }
  }
`;
