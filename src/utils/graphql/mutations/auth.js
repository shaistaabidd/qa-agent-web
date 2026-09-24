import { gql } from '@apollo/client'

export const userFields = `id email createdAt`

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $password: String!) {
    registerUser(input: { email: $email, password: $password }) {
      token
      user { ${userFields} }
    }
  }
`

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      token
      user { ${userFields} }
    }
  }
`
