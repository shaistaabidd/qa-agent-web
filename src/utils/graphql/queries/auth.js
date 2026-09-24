import { gql } from '@apollo/client'
import { userFields } from '@graphql/mutations/auth'

export const ME = gql`
  query Me {
    me { ${userFields} }
  }
`
