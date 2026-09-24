import { gql } from '@apollo/client'
import { scopeFeatureFields } from '@graphql/mutations/scopeFeatures'

export const SCOPE_FEATURES_FOR_PROJECT = gql`
  query ScopeFeaturesForProject($projectId: ID!, $page: Int, $perPage: Int) {
    scopeFeaturesForProject(projectId: $projectId, page: $page, perPage: $perPage) {
      totalPages
      nextPage
      prevPage
      allData { ${scopeFeatureFields} }
    }
  }
`
