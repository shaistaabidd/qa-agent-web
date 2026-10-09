import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import { FETCH_RUN } from '@graphql/queries/runs'
import { Loading, ErrorComponent, EmptyState, SelectField } from '@components/index'
import { FindingsTable } from './FindingsTable'

const SLOW_MS = 1000
const MAX_ROWS = 300
const LOG_FILTERS = [
  { value: 'errors', label: 'Errors (4xx/5xx)' },
  { value: 'slow', label: `Slow (≥ ${SLOW_MS} ms)` },
  { value: 'backend', label: 'Backend issues (N+1, exceptions)' },
]

const pathOf = (url) => {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}
const seconds = (ms) => (ms == null ? '—' : `${(ms / 1000).toFixed(1)} s`)

const Tile = ({ label, value, hint, tone }) => (
  <div className="border rounded p-2 bg-white" style={{ minWidth: 130 }}>
    <div className="text-12 text-gray-600">{label}</div>
    <div className={`text-20 semibold ${tone ? `text-${tone}` : ''}`}>{value}</div>
    {hint && <div className="text-12 text-gray-600">{hint}</div>}
  </div>
)

const statusVariant = (status) => (status >= 500 ? 'danger' : status >= 400 ? 'warning' : 'success')

// One run, Scout/Sentry style: what it covered, how each endpoint performed,
// every API call it saw (with the backend's SQL and errors), memory per page,
// and the findings it reported.
export const RunDetail = ({ runId, projectId }) => {
  const { data, loading, error } = useQuery(FETCH_RUN, { variables: { id: runId }, fetchPolicy: 'network-only' })
  const [logFilter, setLogFilter] = useState('')
  const [search, setSearch] = useState('')

  const run = data?.fetchRun
  const summary = run?.summary || {}
  const networkLog = useMemo(() => run?.networkLog || [], [run])

  const filteredLog = useMemo(() => {
    const term = search.trim().toLowerCase()
    return networkLog.filter((entry) => {
      if (logFilter === 'errors' && !(entry.status >= 400)) return false
      if (logFilter === 'slow' && !(entry.durationMs >= SLOW_MS)) return false
      if (logFilter === 'backend' && !(entry.probe?.nPlusOne || entry.probe?.exceptions)) return false
      return !term || `${entry.label} ${entry.page} ${entry.step}`.toLowerCase().includes(term)
    })
  }, [networkLog, logFilter, search])

  if (loading) return <Loading />
  if (error) return <ErrorComponent error={error} />
  if (!run) return null

  const severities = summary.findingsBySeverity || {}
  const backend = summary.backend

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Tile label="Duration" value={seconds(summary.durationMs)} hint={summary.browser} />
        <Tile label="Coverage" value={`${summary.pages ?? 0} pages`} hint={`${summary.clicks ?? 0} controls clicked`} />
        <Tile
          label="API calls"
          value={summary.apiCalls ?? networkLog.length}
          hint={`${summary.failedCalls ?? 0} failed`}
          tone={summary.failedCalls ? 'danger' : null}
        />
        {backend && (
          <>
            <Tile label="SQL" value={backend.sqlQueries} hint={`${backend.sqlMs} ms in database`} />
            <Tile label="N+1 patterns" value={backend.nPlusOne} tone={backend.nPlusOne ? 'warning' : null} />
            <Tile label="Backend exceptions" value={backend.exceptions} tone={backend.exceptions ? 'danger' : null} />
          </>
        )}
        <Tile
          label="Findings"
          value={Object.values(severities).reduce((a, b) => a + b, 0)}
          hint={['critical', 'high', 'medium', 'low'].filter((s) => severities[s]).map((s) => `${severities[s]} ${s}`).join(' · ') || 'none'}
          tone={severities.critical ? 'danger' : null}
        />
      </div>

      <Tabs defaultActiveKey="findings" className="mb-3" mountOnEnter>
        <Tab eventKey="findings" title="Findings">
          <FindingsTable projectId={projectId} runId={runId} />
        </Tab>

        <Tab eventKey="endpoints" title="Endpoints">
          {summary.endpoints?.length ? (
            <Table size="sm" hover responsive className="text-14">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Calls</th>
                  <th>Avg</th>
                  <th>Max</th>
                  <th>Total</th>
                  <th>SQL queries</th>
                </tr>
              </thead>
              <tbody>
                {summary.endpoints.map((endpoint) => (
                  <tr key={endpoint.label}>
                    <td>{endpoint.label}</td>
                    <td>{endpoint.count}</td>
                    <td className={endpoint.avgMs >= SLOW_MS ? 'text-danger semibold' : ''}>{endpoint.avgMs} ms</td>
                    <td>{endpoint.maxMs} ms</td>
                    <td>{endpoint.totalMs} ms</td>
                    <td>{backend ? endpoint.queries : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="No API calls recorded" />
          )}
        </Tab>

        <Tab eventKey="api-log" title={`API log (${networkLog.length})`}>
          <div className="d-flex gap-2 mb-2 align-items-start">
            <Form.Control
              placeholder="Search operation, page or step…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 320 }}
            />
            <div style={{ width: 260 }}>
              <SelectField name="logFilter" value={logFilter} onChange={(e) => setLogFilter(e.target.value)} options={LOG_FILTERS} blankLabel="All calls" />
            </div>
          </div>
          {filteredLog.length === 0 ? (
            <EmptyState title="No matching calls" />
          ) : (
            <Table size="sm" hover responsive className="text-12">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Call</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>SQL</th>
                  <th>Backend</th>
                  <th>Page / step</th>
                </tr>
              </thead>
              <tbody>
                {filteredLog.slice(0, MAX_ROWS).map((entry, index) => (
                  <tr key={`${entry.at}-${index}`}>
                    <td className="text-nowrap text-gray-600">{new Date(entry.at).toLocaleTimeString()}</td>
                    <td>
                      {entry.label}
                      {entry.resourceType === 'document' && <span className="text-gray-600"> (page)</span>}
                    </td>
                    <td>
                      <Badge bg={statusVariant(entry.status)}>{entry.status}</Badge>
                    </td>
                    <td className={`text-nowrap ${entry.durationMs >= SLOW_MS ? 'text-danger semibold' : ''}`}>
                      {entry.durationMs != null ? `${entry.durationMs} ms` : '—'}
                    </td>
                    <td className="text-nowrap">{entry.probe ? `${entry.probe.queries} q · ${entry.probe.sqlMs} ms` : '—'}</td>
                    <td className="text-nowrap">
                      {entry.probe?.nPlusOne > 0 && <Badge bg="warning" className="me-1">N+1 ×{entry.probe.nPlusOne}</Badge>}
                      {entry.probe?.exceptions > 0 && <Badge bg="danger">{entry.probe.exceptions} exception(s)</Badge>}
                    </td>
                    <td className="text-gray-600">
                      {pathOf(entry.page)}
                      {entry.step && entry.step.startsWith('Click') ? ` · ${entry.step}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {filteredLog.length > MAX_ROWS && (
            <div className="text-12 text-gray-600">Showing the first {MAX_ROWS} of {filteredLog.length} calls — narrow the filter to see more.</div>
          )}
        </Tab>

        <Tab eventKey="memory" title="Memory">
          {summary.memory?.length ? (
            <Table size="sm" className="text-14">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>JS heap (after GC)</th>
                  <th>DOM nodes</th>
                  <th>Event listeners</th>
                </tr>
              </thead>
              <tbody>
                {summary.memory.map((sample, index) => (
                  <tr key={index}>
                    <td>{sample.page}</td>
                    <td>{sample.heapMb} MB</td>
                    <td>{sample.nodes}</td>
                    <td>{sample.listeners}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="No memory samples" description="Memory is measured in Chromium-based browsers only." />
          )}
          {backend?.jobs?.length > 0 && (
            <>
              <div className="text-14 semibold mt-3 mb-1">Background jobs during the run</div>
              <Table size="sm" className="text-14">
                <tbody>
                  {backend.jobs.map((job, index) => (
                    <tr key={index}>
                      <td>{job.name}</td>
                      <td>{job.status}</td>
                      <td>{job.durationMs} ms</td>
                      <td>{job.queries} queries</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Tab>

        <Tab eventKey="audit" title="Audit log">
          <Table size="sm" className="text-12">
            <tbody>
              {run.auditLogEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="text-nowrap semibold">{entry.actionTaken}</td>
                  <td>{entry.targetElement}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </div>
  )
}
