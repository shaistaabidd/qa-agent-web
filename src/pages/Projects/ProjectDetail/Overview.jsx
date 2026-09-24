import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import { CONNECT_GITHUB, SCAN_CODEBASE, CONNECT_CLICK_UP } from '@graphql/mutations/integrations'
import { FETCH_PROJECT } from '@graphql/queries/projects'
import { ButtonComponent, InputField, ErrorComponent } from '@components/index'
import { HandleChange, SweetAlert } from '@services/index'

export const Overview = ({ project }) => {
  const [githubForm, setGithubForm] = useState({ installationId: '', repoFullName: '' })
  const [clickUpForm, setClickUpForm] = useState({ listId: '' })

  const refetchQueries = [{ query: FETCH_PROJECT, variables: { id: project.id } }]

  const [connectGithub, { loading: connectingGithub, error: githubError }] = useMutation(
    CONNECT_GITHUB,
    { refetchQueries }
  )
  const [scanCodebase, { loading: scanning }] = useMutation(SCAN_CODEBASE)
  const [connectClickUp, { loading: connectingClickUp, error: clickUpError }] = useMutation(
    CONNECT_CLICK_UP,
    { refetchQueries }
  )

  const handleConnectGithub = async (e) => {
    e.preventDefault()
    await connectGithub({ variables: { projectId: project.id, ...githubForm } })
    SweetAlert('GitHub repo connected')
  }

  const handleScan = async () => {
    const { data } = await scanCodebase({ variables: { projectId: project.id } })
    if (data?.scanCodebase?.success) SweetAlert(data.scanCodebase.message)
  }

  const handleConnectClickUp = async (e) => {
    e.preventDefault()
    await connectClickUp({ variables: { projectId: project.id, ...clickUpForm } })
    SweetAlert('ClickUp list connected')
  }

  return (
    <Row className="g-3">
      <Col md={6}>
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="text-16 semibold">GitHub</div>
              <Badge bg={project.repoConnected ? 'success' : 'secondary'}>
                {project.repoConnected ? 'Connected' : 'Not connected'}
              </Badge>
            </div>
            <ErrorComponent error={githubError} />
            <form onSubmit={handleConnectGithub}>
              <InputField
                label="Installation ID"
                name="installationId"
                value={githubForm.installationId}
                onChange={(e) => HandleChange(e, setGithubForm)}
                required
              />
              <InputField
                label="Repo (owner/name)"
                name="repoFullName"
                placeholder="acme-corp/checkout-app"
                value={githubForm.repoFullName}
                onChange={(e) => HandleChange(e, setGithubForm)}
                required
              />
              <ButtonComponent type="submit" loading={connectingGithub}>
                Connect
              </ButtonComponent>
            </form>
            <hr />
            <ButtonComponent
              variant="outline-primary"
              loading={scanning}
              disabled={!project.repoConnected}
              onClick={handleScan}
            >
              Scan codebase
            </ButtonComponent>
            {!project.repoConnected && (
              <div className="text-14 text-gray-600 mt-2">Connect a repo before scanning.</div>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card>
          <Card.Body>
            <div className="text-16 semibold mb-3">ClickUp</div>
            <ErrorComponent error={clickUpError} />
            <form onSubmit={handleConnectClickUp}>
              <InputField
                label="List ID"
                name="listId"
                value={clickUpForm.listId}
                onChange={(e) => HandleChange(e, setClickUpForm)}
                required
              />
              <ButtonComponent type="submit" loading={connectingClickUp}>
                Connect
              </ButtonComponent>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
