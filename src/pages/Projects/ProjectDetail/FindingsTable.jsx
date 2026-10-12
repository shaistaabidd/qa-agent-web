import { Fragment, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import { FINDINGS_FOR_PROJECT } from '@graphql/queries/findings'
import { Loading, EmptyState, ErrorComponent, SeverityBadge, PaginationBar, SelectField } from '@components/index'
import { FindingDetail, CATEGORY_VARIANTS } from './FindingDetail'

const SEVERITY_OPTIONS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((value) => ({ value, label: value.toLowerCase() }))
const CATEGORY_OPTIONS = ['error', 'network', 'backend', 'performance', 'memory'].map((value) => ({ value, label: value }))
const SOURCE_OPTIONS = ['frontend', 'backend', 'network'].map((value) => ({ value, label: value }))
const ISSUE_STATUS_VARIANTS = { new: 'primary', ongoing: 'secondary', regressed: 'danger', resolved: 'success' }
// Where the problem lives: the browser, the server, or the request between them.
const SOURCE_VARIANTS = { frontend: 'info', backend: 'dark', network: 'warning' }

const timeAgo = (iso) => {
  if (!iso) return '—'
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  return hours < 24 ? `${hours} h ago` : new Date(iso).toLocaleDateString()
}

// Issues (one row per fingerprint, Sentry-style) or, with `runId`, every
// finding of a single run.
export const FindingsTable = ({ projectId, runId = null }) => {
  const grouped = !runId
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ severity: '', category: '', source: '' })
  const [openId, setOpenId] = useState(null)

  const { data, loading, error } = useQuery(FINDINGS_FOR_PROJECT, {
    variables: {
      projectId,
      page,
      grouped,
      runId,
      severity: filters.severity || null,
      category: filters.category || null,
      source: filters.source || null,
    },
    // Runs report findings in the background, so re-check whenever this opens.
    fetchPolicy: 'cache-and-network',
  })

  const setFilter = (e) => {
    setFilters((current) => ({ ...current, [e.target.name]: e.target.value }))
    setPage(1)
  }

  const findings = data?.findingsForProject?.allData || []
  const columns = grouped ? 8 : 6

  return (
    <div>
      <div className="d-flex gap-2 justify-content-end mb-2">
        <div style={{ width: 160 }}>
          <SelectField name="source" value={filters.source} onChange={setFilter} options={SOURCE_OPTIONS} blankLabel="All sources" />
        </div>
        <div style={{ width: 170 }}>
          <SelectField name="severity" value={filters.severity} onChange={setFilter} options={SEVERITY_OPTIONS} blankLabel="All severities" />
        </div>
        <div style={{ width: 170 }}>
          <SelectField name="category" value={filters.category} onChange={setFilter} options={CATEGORY_OPTIONS} blankLabel="All categories" />
        </div>
      </div>
      <ErrorComponent error={error} />
      {loading && !data ? (
        <Loading />
      ) : findings.length === 0 ? (
        <EmptyState
          title={grouped ? 'No issues' : 'No findings in this run'}
          description={grouped ? 'Issues appear here once a run reports problems.' : 'Nothing broke during this run.'}
        />
      ) : (
        <Table hover responsive className="text-14">
          <thead>
            <tr>
              <th>{grouped ? 'Issue' : 'Finding'}</th>
              <th>Severity</th>
              <th>Source</th>
              <th>Category</th>
              {grouped && <th>Status</th>}
              {grouped && <th>Runs</th>}
              <th>{grouped ? 'Last seen' : 'Reported'}</th>
              <th>ClickUp</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((finding) => (
              <Fragment key={finding.id}>
                <tr onClick={() => setOpenId(openId === finding.id ? null : finding.id)} style={{ cursor: 'pointer' }}>
                  <td>
                    {openId === finding.id ? '▾' : '▸'} {finding.title}
                    {finding.details?.occurrences > 1 && <span className="text-gray-600"> ×{finding.details.occurrences}</span>}
                  </td>
                  <td>
                    <SeverityBadge severity={finding.severity} />
                  </td>
                  <td>
                    <Badge bg={SOURCE_VARIANTS[finding.source] || 'secondary'}>{finding.source}</Badge>
                  </td>
                  <td>
                    {finding.category ? <Badge bg={CATEGORY_VARIANTS[finding.category] || 'secondary'}>{finding.category}</Badge> : '—'}
                  </td>
                  {grouped && (
                    <td>
                      <Badge bg={ISSUE_STATUS_VARIANTS[finding.issueStatus] || 'secondary'}>{finding.issueStatus || '—'}</Badge>
                    </td>
                  )}
                  {grouped && <td>{finding.timesSeen ?? '—'}</td>}
                  <td className="text-nowrap">{timeAgo(grouped ? finding.lastSeenAt : finding.createdAt)}</td>
                  <td>{finding.clickupTaskId ? 'Posted' : '—'}</td>
                </tr>
                {openId === finding.id && (
                  <tr className="qa-detail-row">
                    <td colSpan={columns}>
                      <FindingDetail finding={finding} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </Table>
      )}
      <PaginationBar page={page} totalPages={data?.findingsForProject?.totalPages || 1} onPageChange={setPage} />
    </div>
  )
}
