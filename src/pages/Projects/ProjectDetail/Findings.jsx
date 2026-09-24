import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import Table from 'react-bootstrap/Table'
import { FINDINGS_FOR_PROJECT } from '@graphql/queries/findings'
import { Loading, EmptyState, ErrorComponent, SeverityBadge, PaginationBar } from '@components/index'

export const Findings = ({ project }) => {
  const [page, setPage] = useState(1)

  const { data, loading, error } = useQuery(FINDINGS_FOR_PROJECT, {
    variables: { projectId: project.id, page },
  })

  if (loading) return <Loading />

  const findings = data?.findingsForProject?.allData || []

  return (
    <div>
      <ErrorComponent error={error} />
      {findings.length === 0 ? (
        <EmptyState title="No findings yet" description="Findings appear here once a run reports issues." />
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Severity</th>
              <th>Screenshot</th>
              <th>ClickUp</th>
              <th>Reported</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((finding) => (
              <tr key={finding.id}>
                <td>{finding.title}</td>
                <td>
                  <SeverityBadge severity={finding.severity} />
                </td>
                <td>
                  {finding.screenshotUrl ? (
                    <a href={finding.screenshotUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{finding.clickupTaskId ? 'Posted' : 'Pending'}</td>
                <td>{new Date(finding.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <PaginationBar
        page={page}
        totalPages={data?.findingsForProject?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  )
}
