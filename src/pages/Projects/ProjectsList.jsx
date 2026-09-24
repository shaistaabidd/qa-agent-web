import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import { MY_PROJECTS } from '@graphql/queries/projects'
import { CREATE_PROJECT } from '@graphql/mutations/projects'
import {
  ButtonComponent,
  InputField,
  Loading,
  EmptyState,
  ErrorComponent,
  PaginationBar,
} from '@components/index'
import { HandleChange, SweetAlert } from '@services/index'

export const ProjectsList = () => {
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', targetUrl: '' })

  const { data, loading, error, refetch } = useQuery(MY_PROJECTS, { variables: { page } })
  const [createProject, { loading: creating }] = useMutation(CREATE_PROJECT)

  const handleCreate = async (e) => {
    e.preventDefault()
    await createProject({ variables: form })
    SweetAlert('Project created')
    setShowCreate(false)
    setForm({ name: '', targetUrl: '' })
    refetch()
  }

  if (loading) return <Loading />

  const projects = data?.myProjects?.allData || []

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-20 semibold">Projects</div>
        <ButtonComponent onClick={() => setShowCreate(true)}>New project</ButtonComponent>
      </div>

      <ErrorComponent error={error} />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create a project to start connecting a repo and scanning it."
        />
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Target URL</th>
              <th>GitHub</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </td>
                <td>{project.targetUrl}</td>
                <td>
                  <Badge bg={project.repoConnected ? 'success' : 'secondary'}>
                    {project.repoConnected ? 'Connected' : 'Not connected'}
                  </Badge>
                </td>
                <td>{new Date(project.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <PaginationBar
        page={page}
        totalPages={data?.myProjects?.totalPages || 1}
        onPageChange={setPage}
      />

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New project</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleCreate}>
          <Modal.Body>
            <InputField
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => HandleChange(e, setForm)}
              required
            />
            <InputField
              label="Staging target URL"
              name="targetUrl"
              type="url"
              placeholder="https://staging.example.com"
              value={form.targetUrl}
              onChange={(e) => HandleChange(e, setForm)}
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <ButtonComponent type="submit" loading={creating}>
              Create
            </ButtonComponent>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}
