import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { LOGIN_USER } from '@graphql/mutations/auth'
import { InputField, ButtonComponent, ErrorComponent } from '@components/index'
import { HandleChange, useAuthentication } from '@services/index'

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER)
  const { handleAuthResponse } = useAuthentication()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await loginUser({ variables: form })
    if (data?.loginUser) handleAuthResponse(data.loginUser)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-18 semibold mb-3">Log in</div>
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
        Log in
      </ButtonComponent>
      <div className="text-center mt-3 text-14">
        Don&apos;t have an account? <Link to="/register">Create one</Link>
      </div>
    </form>
  )
}
