import { gql } from '@apollo/client';

import { connectionFields, scopeFeatureFields } from '../fragments';

export const ALL_SCOPE_FEATURES = gql`
  query AllScopeFeatures($projectId: ID!, $filter: PaginatedFilterInput) {
    allScopeFeatures(projectId: $projectId, filter: $filter) {
      ${connectionFields}
      allData {
        ${scopeFeatureFields}
      }
    }
  }
`;
