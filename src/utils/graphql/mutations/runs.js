import { gql } from '@apollo/client'

export const runFields = `
  id
  roleName
  status
  startedAt
  finishedAt
  createdAt
  scopeFeature { id name route }
  auditLogEntries { id actionTaken targetElement createdAt }
`

export const DISPATCH_RUN = gql`
  mutation DispatchRun($scopeFeatureId: ID!, $roleName: String!) {
    dispatchRun(input: { scopeFeatureId: $scopeFeatureId, roleName: $roleName }) {
      run { ${runFields} }
    }
  }
`
