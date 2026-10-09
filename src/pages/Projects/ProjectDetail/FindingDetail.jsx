import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'

export const CATEGORY_VARIANTS = {
  error: 'danger',
  network: 'warning',
  backend: 'dark',
  performance: 'info',
  memory: 'primary',
}

const Section = ({ title, children }) => (
  <div className="mb-3">
    <div className="text-14 semibold mb-1">{title}</div>
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-light border rounded p-2 mb-0 text-12" style={{ whiteSpace: 'pre-wrap', maxHeight: 320 }}>
    {children}
  </pre>
)

const Stats = ({ items }) => (
  <div className="d-flex flex-wrap gap-3 text-14">
    {items
      .filter(([, value]) => value != null && value !== '')
      .map(([label, value]) => (
        <div key={label}>
          <span className="text-gray-600">{label}</span> <span className="semibold">{value}</span>
        </div>
      ))}
  </div>
)

const json = (value) => JSON.stringify(value, null, 2)
const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : null)

// Everything a run collected for one finding — the equivalent of a Sentry
// issue page plus a Scout trace: where it happened, the backtrace, the
// request, the SQL behind it, memory, and the breadcrumbs that led to it.
export const FindingDetail = ({ finding }) => {
  const details = finding.details || {}
  const { request, server, metrics, backend, query } = details

  return (
    <div className="p-3">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3 text-14">
        {finding.category && <Badge bg={CATEGORY_VARIANTS[finding.category] || 'secondary'}>{finding.category}</Badge>}
        {details.type && <span className="text-gray-600">{details.type.replace(/_/g, ' ')}</span>}
        {details.handled === false && <Badge bg="danger">unhandled</Badge>}
        {details.handled === true && <Badge bg="warning">handled (swallowed)</Badge>}
        {details.occurrences > 1 && <Badge bg="dark">{details.occurrences}× in this run</Badge>}
        {details.location && <code>{details.location}</code>}
      </div>

      {finding.timesSeen != null && (
        <Section title="Issue history">
          <Stats
            items={[
              ['Seen in', `${finding.timesSeen} run(s)`],
              ['First seen', formatDate(finding.firstSeenAt)],
              ['Last seen', formatDate(finding.lastSeenAt)],
              ['Status', finding.issueStatus],
            ]}
          />
        </Section>
      )}

      <Section title="Steps to reproduce">
        <ol className="mb-0 text-14">
          {finding.reproSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </Section>

      {details.pages?.length > 0 && (
        <Section title={`Seen on ${details.pages.length} page(s)`}>
          <ul className="mb-0 text-14">
            {details.pages.map((page) => (
              <li key={page}>{page}</li>
            ))}
          </ul>
        </Section>
      )}

      {details.message && !['slow_request', 'n_plus_one', 'slow_query'].includes(details.type) && (
        <Section title={details.errorName || 'Message'}>
          <Code>{details.message}</Code>
        </Section>
      )}

      {details.stack && (
        <Section title="Stack trace (browser)">
          <Code>{details.stack}</Code>
        </Section>
      )}

      {details.backtrace?.length > 0 && (
        <Section title="Backtrace (server)">
          <Code>{details.backtrace.join('\n')}</Code>
        </Section>
      )}

      {query && (
        <Section title={details.type === 'n_plus_one' ? 'Repeated query (N+1)' : 'Query'}>
          <Stats
            items={[
              ['Runs', query.count != null ? `${query.count}×` : null],
              ['Total', query.total_ms != null ? `${query.total_ms} ms` : null],
              ['Slowest', query.max_ms != null ? `${query.max_ms} ms` : query.ms != null ? `${query.ms} ms` : null],
              ['Called from', query.caller],
            ]}
          />
          <div className="mt-2">
            <Code>{query.sample || query.sql}</Code>
          </div>
          {query.suggestion && <div className="text-14 mt-2">Fix: {query.suggestion}</div>}
        </Section>
      )}

      {backend && (
        <Section title={`Backend ${backend.kind === 'job' ? 'job' : 'request'}: ${backend.name}`}>
          <Stats
            items={[
              ['Status', backend.status],
              ['Duration', backend.durationMs != null ? `${backend.durationMs} ms` : null],
              ['SQL', backend.db ? `${backend.db.queries} queries, ${backend.db.total_ms} ms` : null],
              ['Cached', backend.db?.cached],
              ['Allocated', backend.memory?.allocated_objects?.toLocaleString()],
              [
                'RSS',
                backend.memory?.rss_delta_mb != null
                  ? `${backend.memory.rss_before_mb} → ${backend.memory.rss_after_mb} MB`
                  : null,
              ],
              ['GC runs', backend.memory?.gc_runs],
            ]}
          />
          {backend.topQueries?.length > 0 && (
            <Table size="sm" className="text-12 mt-2 mb-0">
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Count</th>
                  <th>Total</th>
                  <th>From</th>
                </tr>
              </thead>
              <tbody>
                {backend.topQueries.map((q, index) => (
                  <tr key={index}>
                    <td style={{ maxWidth: 420 }} className="text-truncate" title={q.sql}>
                      {q.sql}
                    </td>
                    <td>{q.count}</td>
                    <td className="text-nowrap">{q.total_ms} ms</td>
                    <td className="text-nowrap">{q.caller || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Section>
      )}

      {server?.totalMs != null && (
        <Section title="Server time breakdown">
          <Stats
            items={[
              ['Total', `${server.totalMs} ms`],
              ['Database', server.dbMs != null ? `${server.dbMs} ms` : null],
              ['Queries', server.queries],
              ['Other', server.otherMs != null ? `${server.otherMs} ms` : null],
            ]}
          />
          {server.diagnosis && <div className="text-14 text-gray-600 mt-1">{server.diagnosis}</div>}
        </Section>
      )}

      {metrics && (
        <Section title="Page performance">
          <Stats
            items={[
              ['TTFB', `${metrics.ttfbMs ?? '—'} ms`],
              ['DOM ready', `${metrics.domContentLoadedMs ?? '—'} ms`],
              ['LCP', `${metrics.lcpMs ?? '—'} ms`],
              ['CLS', metrics.cls],
              ['Long tasks', `${metrics.longTaskMs} ms`],
            ]}
          />
        </Section>
      )}

      {(details.memoryBefore || details.memory) && (
        <Section title="Browser memory (after garbage collection)">
          {details.memoryBefore ? (
            <Stats
              items={[
                ['JS heap', `${details.memoryBefore.heapMb} → ${details.memoryAfter.heapMb} MB`],
                ['DOM nodes', `${details.memoryBefore.nodes} → ${details.memoryAfter.nodes}`],
                ['Listeners', `${details.memoryBefore.listeners} → ${details.memoryAfter.listeners}`],
              ]}
            />
          ) : (
            <Stats
              items={[
                ['JS heap', `${details.memory.heapMb} MB`],
                ['DOM nodes', details.memory.nodes],
                ['Listeners', details.memory.listeners],
              ]}
            />
          )}
        </Section>
      )}

      {request && (
        <Section title="Request">
          <Code>
            {json({
              operation: request.operationName || undefined,
              method: request.method,
              url: request.url,
              status: request.status,
              durationMs: request.durationMs,
              variables: request.variables,
            })}
          </Code>
          {details.samplesMs?.length > 1 && (
            <div className="text-14 text-gray-600 mt-1">Durations seen: {details.samplesMs.join(', ')} ms</div>
          )}
        </Section>
      )}

      {(details.graphqlPath || details.extensions) && (
        <Section title="GraphQL error">
          <Code>{json({ path: details.graphqlPath, extensions: details.extensions })}</Code>
        </Section>
      )}

      {details.responseBody && (
        <Section title="Response body">
          <Code>{details.responseBody}</Code>
        </Section>
      )}

      {details.excerpt && (
        <Section title="Text on screen">
          <Code>{details.excerpt}</Code>
        </Section>
      )}

      {details.breadcrumbs?.length > 0 && (
        <Section title="Breadcrumbs (what happened before)">
          <Table size="sm" className="text-12 mb-0">
            <tbody>
              {details.breadcrumbs.map((crumb, index) => (
                <tr key={index}>
                  <td className="text-gray-600 text-nowrap">{new Date(crumb.at).toLocaleTimeString()}</td>
                  <td className="text-nowrap">{crumb.type}</td>
                  <td>{crumb.message}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}

      {finding.screenshotUrl && (
        <Section title="Screenshot">
          <a href={finding.screenshotUrl} target="_blank" rel="noreferrer">
            <img src={finding.screenshotUrl} alt="" className="border rounded" style={{ maxWidth: 480, width: '100%' }} />
          </a>
        </Section>
      )}
    </div>
  )
}
