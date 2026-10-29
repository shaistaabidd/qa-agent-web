import { gql } from '@apollo/client';

import { connectionFields, runFields, runListFields } from '../fragments';

export const ALL_RUNS = gql`
  query AllRuns($projectId: ID!, $filter: RunFilterInput) {
    allRuns(projectId: $projectId, filter: $filter) {
      ${connectionFields}
      allData {
        ${runListFields}
      }
    }
  }
`;

export const FETCH_RUN = gql`
  query FetchRun($id: ID!) {
    fetchRun(id: $id) {
      ${runFields}
    }
  }
`;
