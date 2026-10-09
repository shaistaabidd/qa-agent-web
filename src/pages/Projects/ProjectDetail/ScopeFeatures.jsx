import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import { SCOPE_FEATURES_FOR_PROJECT } from '@graphql/queries/scopeFeatures'
import { APPROVE_SCOPE_FEATURE } from '@graphql/mutations/scopeFeatures'
import { ButtonComponent, Loading, EmptyState, ErrorComponent, PaginationBar } from '@components/index'
import { SweetAlert } from '@services/index'

export const ScopeFeatures = ({ project }) => {
  const [page, setPage] = useState(1)

  const { data, loading, error, refetch } = useQuery(SCOPE_FEATURES_FOR_PROJECT, {
    variables: { projectId: project.id, page },
    // Scans finish in the background, so re-check whenever the tab is opened.
    fetchPolicy: 'cache-and-network',
  })
  const [approveScopeFeature, { loading: approving }] = useMutation(APPROVE_SCOPE_FEATURE)

  const handleApprove = async (id) => {
    await approveScopeFeature({ variables: { id } })
    SweetAlert('Scope feature approved')
    refetch()
  }

  if (loading) return <Loading />

  const features = data?.scopeFeaturesForProject?.allData || []

  return (
    <div>
      <ErrorComponent error={error} />
      {features.length === 0 ? (
        <EmptyState
          title="No scope features yet"
          description="Scan the codebase from the Overview tab to generate some."
        />
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Route</th>
              <th>Source</th>
              <th>Approved</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.id}>
                <td>{feature.name}</td>
                <td>{feature.route || '—'}</td>
                <td className="text-14 text-gray-600">{feature.source}</td>
                <td>
                  <Badge bg={feature.approved ? 'success' : 'secondary'}>
                    {feature.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </td>
                <td>
                  {!feature.approved && (
                    <ButtonComponent
                      variant="outline-primary"
                      loading={approving}
                      onClick={() => handleApprove(feature.id)}
                    >
                      Approve
                    </ButtonComponent>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <PaginationBar
        page={page}
        totalPages={data?.scopeFeaturesForProject?.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  )
}
