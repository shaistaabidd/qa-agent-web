import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Badge from 'react-bootstrap/Badge'
import { FETCH_PROJECT } from '@graphql/queries/projects'
import { FINDINGS_SUMMARY } from '@graphql/queries/dashboard'
import { Loading, ErrorComponent, PageHeader, Icon, TabTitle, toneFor } from '@components/index'
import { Overview } from './Overview'
import { Credentials } from './Credentials'
import { ScopeFeatures } from './ScopeFeatures'
import { Runs } from './Runs'
import { Findings } from './Findings'
import { Dashboard } from './Dashboard'

export const ProjectDetail = () => {
  const { id } = useParams()
  const { data, loading, error } = useQuery(FETCH_PROJECT, { variables: { id } })
  // Open issues for the Issues tab label; refreshed on every tab switch since
  // runs finish in the background.
  const { data: summaryData, refetch: refetchSummary } = useQuery(FINDINGS_SUMMARY, {
    variables: { projectId: id },
    fetchPolicy: 'cache-and-network',
  })

  if (loading) return <Loading />
  if (error) return <ErrorComponent error={error} />

  const project = data?.fetchProject
  if (!project) return null

  const openIssues = summaryData?.findingsSummary
  const openBySeverity = Object.fromEntries((openIssues?.bySeverity || []).map((row) => [row.severity, row.count]))

  return (
    <div>
      <PageHeader
        title={project.name}
        backTo="/projects"
        backLabel="All projects"
        badge={
          <Badge bg={project.repoConnected ? 'success' : 'secondary'}>
            {project.repoConnected ? 'GitHub connected' : 'GitHub not connected'}
          </Badge>
        }
      >
        <div className="qa-meta">
          <a href={project.targetUrl} target="_blank" rel="noreferrer">
            <Icon name="link" size={14} />
            {project.targetUrl}
          </a>
          {project.repoFullName && (
            <span>
              <Icon name="github" size={14} />
              {project.repoFullName}
            </span>
          )}
        </div>
      </PageHeader>

      <Tabs
        defaultActiveKey="overview"
        className="mb-4"
        mountOnEnter
        unmountOnExit
        onSelect={() => refetchSummary().catch(() => {})}
      >
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
        <Tab
          eventKey="findings"
          title={
            <TabTitle
              label="Issues"
              count={openIssues?.total}
              tone={toneFor(openBySeverity)}
              title="Open issues (not resolved)"
            />
          }
        >
          <Findings project={project} />
        </Tab>
        <Tab eventKey="dashboard" title="Dashboard">
          <Dashboard project={project} />
        </Tab>
      </Tabs>
    </div>
  )
}
