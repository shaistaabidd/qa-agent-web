import { gql } from '@apollo/client'

export const findingFields = `
  id
  title
  reproSteps
  severity
  screenshotUrl
  category
  details
  fingerprint
  runId
  timesSeen
  firstSeenAt
  lastSeenAt
  issueStatus
  clickupTaskId
  createdAt
`

export const FINDINGS_FOR_PROJECT = gql`
  query FindingsForProject(
    $projectId: ID!
    $page: Int
    $perPage: Int
    $grouped: Boolean
    $runId: ID
    $severity: FindingSeverityEnum
    $category: String
  ) {
    findingsForProject(
      projectId: $projectId
      page: $page
      perPage: $perPage
      grouped: $grouped
      runId: $runId
      severity: $severity
      category: $category
    ) {
      totalPages
      nextPage
      prevPage
      allData { ${findingFields} }
    }
  }
`
