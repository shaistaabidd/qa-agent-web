import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  CombinedGraphQLErrors,
} from '@apollo/client'
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename'
import { ApolloProvider as Provider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { SweetAlert } from '@services/SweetAlert'

// VITE_APP_API_URL is tolerated either as the server root ("http://host:port")
// or as the full GraphQL endpoint already including "/graphql" — normalize
// here instead of assuming one form, since getting this wrong produces a
// silent .../graphql/graphql 404 that just looks like "Failed to fetch".
const rawApiUrl = (import.meta.env.VITE_APP_API_URL || '').replace(/\/+$/, '')
const graphqlUri = rawApiUrl.endsWith('/graphql') ? rawApiUrl : `${rawApiUrl}/graphql`

// No upload link — every mutation this dashboard calls takes plain scalar
// input. The one file-upload mutation in the schema (createFinding) is
// agent-authenticated only and never called from this frontend.
const httpLink = new HttpLink({
  uri: graphqlUri,
})

const removeTypenameLink = new RemoveTypenameFromVariablesLink()

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Only "Unauthorized" (thrown by authenticate_user! when no/invalid JWT was
// sent) means the session itself is dead and should force a logout+redirect.
// A 401 from a wrong-password login attempt ("Invalid email or password")
// must NOT be caught here — it needs to reach the login form's own error
// state, not bounce the user back to /login before they see why it failed.
const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message }) => {
      if (message === 'Unauthorized' && localStorage.getItem('token')) {
        localStorage.clear()
        window.location.assign('/login')
        return
      }
      SweetAlert(message, 'error')
    })
  } else if (error) {
    SweetAlert('Something went wrong. Please try again.', 'error')
  }
})

const client = new ApolloClient({
  link: ApolloLink.from([removeTypenameLink, errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
})

const ApolloProvider = (props) => {
  return <Provider client={client} {...props} />
}

export default ApolloProvider
