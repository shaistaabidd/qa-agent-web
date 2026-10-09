import { gql } from '@apollo/client'
import { projectFields } from '@graphql/mutations/projects'

export const MY_PROJECTS = gql`
  query MyProjects($page: Int, $perPage: Int) {
    myProjects(page: $page, perPage: $perPage) {
      totalPages
      nextPage
      prevPage
      allData { ${projectFields} }
    }
  }
`

export const FETCH_PROJECT = gql`
  query FetchProject($id: ID!) {
    fetchProject(id: $id) { ${projectFields} githubInstalled repoFullName }
  }
`
