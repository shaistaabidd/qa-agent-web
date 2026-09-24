import { Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import { Header } from './Header'

export const AppLayout = () => {
  return (
    <div className="min-vh-100 bg-light">
      <Header />
      <Container className="py-4">
        <Outlet />
      </Container>
    </div>
  )
}
