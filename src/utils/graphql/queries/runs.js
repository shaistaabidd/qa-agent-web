import { gql } from '@apollo/client'
import { runFields, runDetailFields } from '@graphql/mutations/runs'

export const RUNS_FOR_PROJECT = gql`
  query RunsForProject($projectId: ID!, $status: RunStatusEnum, $page: Int, $perPage: Int) {
    runsForProject(projectId: $projectId, status: $status, page: $page, perPage: $perPage) {
      totalPages
      nextPage
      prevPage
      allData { ${runFields} }
    }
  }
`

export const FETCH_RUN = gql`
  query FetchRun($id: ID!) {
    fetchRun(id: $id) { ${runDetailFields} }
  }
`
