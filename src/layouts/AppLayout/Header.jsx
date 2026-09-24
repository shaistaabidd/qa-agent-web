import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutThunk } from '@store/authSlice'

export const Header = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  return (
    <Navbar bg="white" className="border-bottom px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/projects" className="text-16 semibold">
          QA Agent
        </Navbar.Brand>
        <div className="d-flex align-items-center gap-3">
          {user?.email && <span className="text-14 text-gray-600">{user.email}</span>}
          <Button variant="outline-secondary" size="sm" onClick={() => dispatch(logoutThunk())}>
            Log out
          </Button>
        </div>
      </Container>
    </Navbar>
  )
}
