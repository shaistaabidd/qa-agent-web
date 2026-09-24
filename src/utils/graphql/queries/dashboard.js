import { gql } from '@apollo/client'

export const FINDINGS_SUMMARY = gql`
  query FindingsSummary($projectId: ID!) {
    findingsSummary(projectId: $projectId) {
      total
      postedToClickUp
      pendingClickUp
      bySeverity { severity count }
    }
  }
`

export const COVERAGE = gql`
  query Coverage($projectId: ID!) {
    coverage(projectId: $projectId) {
      totalScopeFeatures
      approvedScopeFeatures
      testedScopeFeatures
      coveragePercentage
    }
  }
`
