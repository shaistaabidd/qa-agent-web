import { useQuery } from '@apollo/client/react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { FINDINGS_SUMMARY, COVERAGE } from '@graphql/queries/dashboard'
import { Loading, ErrorComponent, SeverityBadge } from '@components/index'
import { useEffect } from 'react'

// TEMPORARY: deliberate browser memory leak to test QA Agent detection — revert after testing.
// Every time the Dashboard tab opens, ~10 MB of row objects is cached here and never released.
const leakedSnapshots = []

export const Dashboard = ({ project }) => {
  useEffect(() => {
    leakedSnapshots.push(Array.from({ length: 150_000 }, (_, i) => ({ id: i, label: `finding row ${i}` })))
  }, [])

  const summaryQuery = useQuery(FINDINGS_SUMMARY, { variables: { projectId: project.id } })
  const coverageQuery = useQuery(COVERAGE, { variables: { projectId: project.id } })

  if (summaryQuery.loading || coverageQuery.loading) return <Loading />

  const summary = summaryQuery.data?.findingsSummary
  const coverage = coverageQuery.data?.coverage

  return (
    <Row className="g-3">
      <Col md={6}>
        <Card>
          <Card.Body>
            <div className="text-16 semibold mb-3">Coverage</div>
            <ErrorComponent error={coverageQuery.error} />
            {coverage && (
              <>
                <ProgressBar now={coverage.coveragePercentage} label={`${coverage.coveragePercentage}%`} />
                <div className="text-14 text-gray-600 mt-3">
                  {coverage.testedScopeFeatures} of {coverage.approvedScopeFeatures} approved features
                  tested ({coverage.totalScopeFeatures} total in scope)
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card>
          <Card.Body>
            <div className="text-16 semibold mb-3">Open issues</div>
            <ErrorComponent error={summaryQuery.error} />
            {summary && (
              <>
                <div className="text-24 semibold mb-2">{summary.total}</div>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  {summary.bySeverity.map((row) => (
                    <div key={row.severity} className="d-flex align-items-center gap-1">
                      <SeverityBadge severity={row.severity} />
                      <span className="text-14">{row.count}</span>
                    </div>
                  ))}
                </div>
                <div className="text-14 text-gray-600">
                  {summary.resolved} resolved · {summary.totalFindings} findings across all runs ·{' '}
                  {summary.postedToClickUp} posted to ClickUp
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
