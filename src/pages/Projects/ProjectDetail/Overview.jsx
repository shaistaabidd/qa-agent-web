import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { CONNECT_CLICK_UP } from '@graphql/mutations/integrations'
import { FETCH_PROJECT } from '@graphql/queries/projects'
import { ButtonComponent, InputField, ErrorComponent } from '@components/index'
import { HandleChange, SweetAlert } from '@services/index'
import { GithubConnect } from './GithubConnect'

export const Overview = ({ project }) => {
  const [clickUpForm, setClickUpForm] = useState({ listId: '' })

  const refetchQueries = [{ query: FETCH_PROJECT, variables: { id: project.id } }]

  const [connectClickUp, { loading: connectingClickUp, error: clickUpError }] = useMutation(
    CONNECT_CLICK_UP,
    { refetchQueries }
  )

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
            <GithubConnect project={project} />
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
