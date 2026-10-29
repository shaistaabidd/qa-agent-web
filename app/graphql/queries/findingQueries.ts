import { gql } from '@apollo/client';

import { connectionFields, findingFields, findingListFields } from '../fragments';

export const ALL_FINDINGS = gql`
  query AllFindings($projectId: ID!, $filter: FindingFilterInput) {
    allFindings(projectId: $projectId, filter: $filter) {
      ${connectionFields}
      allData {
        ${findingListFields}
      }
    }
  }
`;

export const FETCH_FINDING = gql`
  query FetchFinding($id: ID!) {
    fetchFinding(id: $id) {
      ${findingFields}
    }
  }
`;

export const FETCH_FINDINGS_SUMMARY = gql`
  query FetchFindingsSummary($projectId: ID!) {
    fetchFindingsSummary(projectId: $projectId) {
      bySeverity {
        count
        severity
      }
      pendingClickUp
      postedToClickUp
      resolved
      total
      totalFindings
    }
  }
`;
