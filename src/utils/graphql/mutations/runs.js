import { gql } from '@apollo/client'

export const runFields = `
  id
  roleName
  status
  startedAt
  finishedAt
  createdAt
  scopeFeature { id name route }
`

// Heavy per-run data, only fetched when a run is opened.
export const runDetailFields = `
  ${runFields}
  summary
  networkLog
  auditLogEntries { id actionTaken targetElement createdAt }
`

export const DISPATCH_RUN = gql`
  mutation DispatchRun($scopeFeatureId: ID!, $roleName: String!) {
    dispatchRun(input: { scopeFeatureId: $scopeFeatureId, roleName: $roleName }) {
      run { ${runFields} }
    }
  }
`
