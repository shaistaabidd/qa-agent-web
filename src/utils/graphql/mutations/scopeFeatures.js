import { gql } from '@apollo/client'

export const scopeFeatureFields = `id name route source approved createdAt`

export const APPROVE_SCOPE_FEATURE = gql`
  mutation ApproveScopeFeature($id: ID!) {
    approveScopeFeature(input: { id: $id }) {
      scopeFeature { ${scopeFeatureFields} }
    }
  }
`
