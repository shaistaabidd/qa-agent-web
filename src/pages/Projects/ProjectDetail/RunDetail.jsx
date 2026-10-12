import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import { FETCH_RUN } from '@graphql/queries/runs'
import { Loading, ErrorComponent, EmptyState, SelectField, TabTitle, toneFor } from '@components/index'
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
  <div className="qa-stat">
    <div className="qa-stat-label">{label}</div>
    <div className={`qa-stat-value ${tone ? `text-${tone}` : ''}`}>{value}</div>
    {hint && <div className="qa-stat-hint">{hint}</div>}
  </div>
)

const statusVariant = (status) => (status >= 500 ? 'danger' : status >= 400 ? 'warning' : 'success')

const LEAK_MB = 5
const BLOAT_OBJECTS = 500_000

// The time that counts for "slow": the isolated re-measurement when the call
// overlapped others during the run, otherwise its own average.
const effectiveMs = (endpoint, isolated) => isolated[endpoint.label]?.durationMs ?? endpoint.avgMs

// Counts for the run's tab labels — only things worth opening the tab for.
const runTabCounts = (summary, networkLog) => {
  const isolated = Object.fromEntries((summary.isolated || []).map((row) => [row.label, row]))
  const findingsByCategory = summary.findingsByCategory || {}
  const severities = summary.findingsBySeverity || {}
  return {
    findings: Object.values(severities).reduce((total, count) => total + count, 0),
    slowEndpoints: (summary.endpoints || []).filter((endpoint) => effectiveMs(endpoint, isolated) >= SLOW_MS).length,
    problemCalls: networkLog.filter((entry) => entry.status >= 400 || entry.probe?.nPlusOne || entry.probe?.exceptions).length,
    memoryIssues: findingsByCategory.memory || 0,
    memoryTone: (summary.leakChecks || []).some((check) => (check.after?.heapMb ?? 0) - (check.before?.heapMb ?? 0) >= LEAK_MB * 4)
      ? 'danger'
      : 'warning',
  }
}

const growth = (before, after) => {
  const delta = Math.round(((after ?? 0) - (before ?? 0)) * 10) / 10
  return `${delta >= 0 ? '+' : ''}${delta}`
}

// Server memory per endpoint: the isolated re-measurement when there is one
// (exact), otherwise the largest reading seen during the run, flagged when
// other requests were running at the same time (shared).
const serverMemoryRows = (summary, networkLog) => {
  const rows = new Map()
  for (const entry of networkLog) {
    if (!entry.probe?.allocatedObjects) continue
    const row = rows.get(entry.label) || { label: entry.label, calls: 0, allocatedObjects: 0, rssDeltaMb: 0, shared: false }
    row.calls += 1
    row.allocatedObjects = Math.max(row.allocatedObjects, entry.probe.allocatedObjects)
    row.rssDeltaMb = Math.max(row.rssDeltaMb, entry.probe.rssDeltaMb ?? 0)
    row.shared = row.shared || entry.probe.overlapped
    rows.set(entry.label, row)
  }
  for (const isolated of summary.isolated || []) {
    const row = rows.get(isolated.label) || { label: isolated.label, calls: 0 }
    rows.set(isolated.label, { ...row, allocatedObjects: isolated.allocatedObjects, rssDeltaMb: isolated.rssDeltaMb, shared: false, isolated: true })
  }
  return [...rows.values()].sort((a, b) => b.allocatedObjects - a.allocatedObjects)
}

const MemoryPanel = ({ summary, networkLog }) => {
  const leakChecks = summary.leakChecks || []
  const server = serverMemoryRows(summary, networkLog)
  const jobs = summary.backend?.jobs || []

  return (
    <div className="d-flex flex-column gap-4">
      <section>
        <div className="text-14 semibold mb-1">Browser — leak checks</div>
        <div className="text-12 text-gray-600 mb-2">
          The page&apos;s clicks are repeated twice; memory still growing after garbage collection (≥ {LEAK_MB} MB) points to a leak.
        </div>
        {leakChecks.length ? (
          <Table size="sm" responsive className="text-14">
            <thead>
              <tr>
                <th>Page</th>
                <th>Clicks repeated</th>
                <th>JS heap</th>
                <th>DOM nodes</th>
                <th>Listeners</th>
              </tr>
            </thead>
            <tbody>
              {leakChecks.map((check, index) => {
                const heapGrowth = (check.after?.heapMb ?? 0) - (check.before?.heapMb ?? 0)
                return (
                  <tr key={index}>
                    <td>{check.page}</td>
                    <td className="text-gray-600">{check.clicks.join(', ')}</td>
                    <td className={heapGrowth >= LEAK_MB ? 'text-danger semibold' : ''}>
                      {check.before?.heapMb} → {check.after?.heapMb} MB ({growth(check.before?.heapMb, check.after?.heapMb)})
                    </td>
                    <td>{check.before?.nodes} → {check.after?.nodes}</td>
                    <td>{check.before?.listeners} → {check.after?.listeners}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        ) : (
          <div className="text-14 text-gray-600">No page had enough repeatable clicks to check.</div>
        )}
      </section>

      <section>
        <div className="text-14 semibold mb-2">Browser — per page (on load, after garbage collection)</div>
        {summary.memory?.length ? (
          <Table size="sm" responsive className="text-14">
            <thead>
              <tr>
                <th>Page</th>
                <th>JS heap</th>
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
          <div className="text-14 text-gray-600">Memory is measured in Chromium-based browsers only.</div>
        )}
      </section>

      <section>
        <div className="text-14 semibold mb-1">Server — per endpoint</div>
        <div className="text-12 text-gray-600 mb-2">
          Ruby objects allocated and process memory growth per request. <Badge bg="success">isolated</Badge> = re-measured
          alone after the run; <Badge bg="warning">shared</Badge> = other requests ran at the same time, so the numbers
          include their work.
        </div>
        {server.length ? (
          <Table size="sm" responsive className="text-14">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Objects allocated</th>
                <th>Memory growth</th>
                <th>Measurement</th>
              </tr>
            </thead>
            <tbody>
              {server.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td className={row.allocatedObjects >= BLOAT_OBJECTS ? 'text-danger semibold' : ''}>
                    {row.allocatedObjects?.toLocaleString()}
                  </td>
                  <td>{row.rssDeltaMb != null ? `${row.rssDeltaMb >= 0 ? '+' : ''}${row.rssDeltaMb} MB` : '—'}</td>
                  <td>
                    {row.isolated ? <Badge bg="success">isolated</Badge> : row.shared ? <Badge bg="warning">shared</Badge> : <Badge bg="secondary">alone</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-14 text-gray-600">No server reports — the backend probe isn&apos;t enabled for this target.</div>
        )}
      </section>

      {jobs.length > 0 && (
        <section>
          <div className="text-14 semibold mb-2">Background jobs during the run</div>
          <Table size="sm" responsive className="text-14">
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index}>
                  <td>{job.name}</td>
                  <td>{job.status}</td>
                  <td>{job.durationMs} ms</td>
                  <td>{job.queries} queries</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}
    </div>
  )
}

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
  const counts = runTabCounts(summary, networkLog)

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap gap-2 mb-4">
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
        <Tab
          eventKey="findings"
          title={<TabTitle label="Findings" count={counts.findings} tone={toneFor(severities)} />}
        >
          <FindingsTable projectId={projectId} runId={runId} />
        </Tab>

        <Tab
          eventKey="endpoints"
          title={<TabTitle label="Endpoints" count={counts.slowEndpoints} tone="warning" title="Slow endpoints" />}
        >
          {summary.endpoints?.length ? (
            <Table size="sm" hover responsive className="text-14">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Calls</th>
                  <th>Avg</th>
                  <th>Max</th>
                  <th>Total</th>
                  <th>Server alone</th>
                  <th>SQL queries</th>
                </tr>
              </thead>
              <tbody>
                {summary.endpoints.map((endpoint) => {
                  const alone = (summary.isolated || []).find((row) => row.label === endpoint.label)
                  const slow = (alone?.durationMs ?? endpoint.avgMs) >= SLOW_MS
                  return (
                  <tr key={endpoint.label}>
                    <td>{endpoint.label}</td>
                    <td>{endpoint.count}</td>
                    <td className={slow && !alone ? 'text-danger semibold' : ''}>{endpoint.avgMs} ms</td>
                    <td>{endpoint.maxMs} ms</td>
                    <td>{endpoint.totalMs} ms</td>
                    <td className={slow && alone ? 'text-danger semibold' : ''}>
                      {alone ? `${Math.round(alone.durationMs)} ms` : '—'}
                    </td>
                    <td>{backend ? endpoint.queries : '—'}</td>
                  </tr>
                  )
                })}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="No API calls recorded" />
          )}
        </Tab>

        <Tab
          eventKey="api-log"
          title={
            <TabTitle
              label={`API log (${networkLog.length})`}
              count={counts.problemCalls}
              tone="danger"
              title="Failed calls and calls with backend problems (N+1, exceptions)"
            />
          }
        >
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

        <Tab
          eventKey="memory"
          title={<TabTitle label="Memory" count={counts.memoryIssues} tone={counts.memoryTone} title="Memory issues" />}
        >
          <MemoryPanel summary={summary} networkLog={networkLog} />
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
