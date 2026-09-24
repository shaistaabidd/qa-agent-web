import { gql } from '@apollo/client'

export const findingFields = `
  id
  title
  reproSteps
  severity
  screenshotUrl
  clickupTaskId
  createdAt
`

export const FINDINGS_FOR_PROJECT = gql`
  query FindingsForProject($projectId: ID!, $page: Int, $perPage: Int) {
    findingsForProject(projectId: $projectId, page: $page, perPage: $perPage) {
      totalPages
      nextPage
      prevPage
      allData { ${findingFields} }
    }
  }
`
