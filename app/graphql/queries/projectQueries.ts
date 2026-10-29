import { gql } from '@apollo/client';

import { connectionFields, projectFields } from '../fragments';

export const ALL_PROJECTS = gql`
  query AllProjects($filter: PaginatedFilterInput) {
    allProjects(filter: $filter) {
      ${connectionFields}
      allData {
        ${projectFields}
      }
    }
  }
`;

export const FETCH_PROJECT = gql`
  query FetchProject($id: ID!) {
    fetchProject(id: $id) {
      ${projectFields}
    }
  }
`;

export const FETCH_COVERAGE = gql`
  query FetchCoverage($projectId: ID!) {
    fetchCoverage(projectId: $projectId) {
      approvedScopeFeatures
      coveragePercentage
      testedScopeFeatures
      totalScopeFeatures
    }
  }
`;
