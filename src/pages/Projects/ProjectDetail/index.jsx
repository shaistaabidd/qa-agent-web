import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Badge from 'react-bootstrap/Badge'
import { FETCH_PROJECT } from '@graphql/queries/projects'
import { Loading, ErrorComponent } from '@components/index'
import { Overview } from './Overview'
import { Credentials } from './Credentials'
import { ScopeFeatures } from './ScopeFeatures'
import { Runs } from './Runs'
import { Findings } from './Findings'
import { Dashboard } from './Dashboard'

export const ProjectDetail = () => {
  const { id } = useParams()
  const { data, loading, error } = useQuery(FETCH_PROJECT, { variables: { id } })

  if (loading) return <Loading />
  if (error) return <ErrorComponent error={error} />

  const project = data?.fetchProject
  if (!project) return null

  return (
    <div>
      <Link to="/projects" className="text-14 d-inline-block mb-2">
        &larr; All projects
      </Link>
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="text-20 semibold">{project.name}</div>
        <Badge bg={project.repoConnected ? 'success' : 'secondary'}>
          {project.repoConnected ? 'GitHub connected' : 'GitHub not connected'}
        </Badge>
      </div>

      <Tabs defaultActiveKey="overview" className="mb-3">
        <Tab eventKey="overview" title="Overview">
          <Overview project={project} />
        </Tab>
        <Tab eventKey="credentials" title="Credentials">
          <Credentials project={project} />
        </Tab>
        <Tab eventKey="scope-features" title="Scope Features">
          <ScopeFeatures project={project} />
        </Tab>
        <Tab eventKey="runs" title="Runs">
          <Runs project={project} />
        </Tab>
        <Tab eventKey="findings" title="Findings">
          <Findings project={project} />
        </Tab>
        <Tab eventKey="dashboard" title="Dashboard">
          <Dashboard project={project} />
        </Tab>
      </Tabs>
    </div>
  )
}
