import { gql } from '@apollo/client'

export const projectFields = `id name targetUrl repoConnected createdAt`

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $targetUrl: String!) {
    createProject(input: { name: $name, targetUrl: $targetUrl }) {
      project { ${projectFields} }
    }
  }
`
