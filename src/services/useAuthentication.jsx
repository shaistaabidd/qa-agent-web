import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '@store/authSlice'

// Shared handler for both loginUser and registerUser responses — both
// mutations return the same AuthPayload { token, user } shape.
export const useAuthentication = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAuthResponse = ({ token, user }) => {
    localStorage.setItem('token', token)
    dispatch(login(user))
    navigate('/projects')
  }

  return { handleAuthResponse }
}
