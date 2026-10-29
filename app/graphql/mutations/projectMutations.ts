import { gql } from '@apollo/client';

import { projectFields } from '../fragments';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      project {
        ${projectFields}
      }
    }
  }
`;

export const CONNECT_CLICK_UP = gql`
  mutation ConnectClickUp($input: ConnectClickUpInput!) {
    connectClickUp(input: $input) {
      project {
        ${projectFields}
      }
    }
  }
`;
