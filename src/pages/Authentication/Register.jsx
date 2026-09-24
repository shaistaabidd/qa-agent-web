import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { REGISTER_USER } from '@graphql/mutations/auth'
import { InputField, ButtonComponent, ErrorComponent } from '@components/index'
import { HandleChange, useAuthentication } from '@services/index'

export const Register = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER)
  const { handleAuthResponse } = useAuthentication()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await registerUser({ variables: form })
    if (data?.registerUser) handleAuthResponse(data.registerUser)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-18 semibold mb-3">Create your account</div>
      <ErrorComponent error={error} />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={(e) => HandleChange(e, setForm)}
        required
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={(e) => HandleChange(e, setForm)}
        required
      />
      <ButtonComponent type="submit" loading={loading} className="w-100 mt-2">
        Create account
      </ButtonComponent>
      <div className="text-center mt-3 text-14">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </form>
  )
}
