import 'bootstrap/dist/css/bootstrap.min.css'
import '@shared/styles/variables.scss'
import ApolloProvider from '@middleware/ApolloProvider'
import Routers from '@routes/index'

function App() {
  return (
    <ApolloProvider>
      <Routers />
    </ApolloProvider>
  )
}

export default App
