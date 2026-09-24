import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import { ROLE_CREDENTIALS_FOR_PROJECT } from '@graphql/queries/roleCredentials'
import { SET_ROLE_CREDENTIAL } from '@graphql/mutations/roleCredentials'
import { ButtonComponent, InputField, Loading, EmptyState, ErrorComponent } from '@components/index'
import { HandleChange, SweetAlert } from '@services/index'

export const Credentials = ({ project }) => {
  const [form, setForm] = useState({ roleName: '', credentialValue: '' })

  const { data, loading, error, refetch } = useQuery(ROLE_CREDENTIALS_FOR_PROJECT, {
    variables: { projectId: project.id },
  })
  const [setRoleCredential, { loading: saving, error: saveError }] = useMutation(
    SET_ROLE_CREDENTIAL
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    await setRoleCredential({ variables: { projectId: project.id, ...form } })
    SweetAlert('Credential saved')
    setForm({ roleName: '', credentialValue: '' })
    refetch()
  }

  if (loading) return <Loading />

  const credentials = data?.roleCredentialsForProject || []

  return (
    <Card>
      <Card.Body>
        <div className="text-16 semibold mb-3">Role credentials</div>
        <div className="text-14 text-gray-600 mb-3">
          Configured once per role (e.g. &quot;admin&quot;). The value is encrypted at rest and
          never shown again here — only whether a role has one configured.
        </div>
        <ErrorComponent error={error} />

        {credentials.length === 0 ? (
          <EmptyState title="No credentials configured yet" />
        ) : (
          <Table hover responsive className="mb-4">
            <thead>
              <tr>
                <th>Role</th>
                <th>Last updated</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((credential) => (
                <tr key={credential.id}>
                  <td>{credential.roleName}</td>
                  <td>{new Date(credential.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <ErrorComponent error={saveError} />
        <form onSubmit={handleSubmit} className="d-flex gap-2 align-items-end">
          <div style={{ flex: 1 }}>
            <InputField
              label="Role name"
              name="roleName"
              placeholder="admin"
              value={form.roleName}
              onChange={(e) => HandleChange(e, setForm)}
              required
            />
          </div>
          <div style={{ flex: 2 }}>
            <InputField
              label="Credential value"
              name="credentialValue"
              type="password"
              value={form.credentialValue}
              onChange={(e) => HandleChange(e, setForm)}
              required
            />
          </div>
          <ButtonComponent type="submit" loading={saving} className="mb-3">
            Save
          </ButtonComponent>
        </form>
      </Card.Body>
    </Card>
  )
}
