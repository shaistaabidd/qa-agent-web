import { Fragment, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import { RUNS_FOR_PROJECT } from '@graphql/queries/runs'
import { DISPATCH_RUN } from '@graphql/mutations/runs'
import { SCOPE_FEATURES_FOR_PROJECT } from '@graphql/queries/scopeFeatures'
import {
  ButtonComponent,
  InputField,
  SelectField,
  Loading,
  EmptyState,
  ErrorComponent,
  RunStatusBadge,
  PaginationBar,
} from '@components/index'
import { HandleChange, SweetAlert } from '@services/index'
import { RunDetail } from './RunDetail'

const STATUS_OPTIONS = [
  { value: 'QUEUED', label: 'Queued' },
  { value: 'RUNNING', label: 'Running' },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
]

export const Runs = ({ project }) => {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [form, setForm] = useState({ scopeFeatureId: '', roleName: '' })
  const [openRunId, setOpenRunId] = useState(null)

  const { data, loading, error, refetch } = useQuery(RUNS_FOR_PROJECT, {
    variables: { projectId: project.id, page, status: status || null },
    // Runs finish in the background, so re-check whenever the tab opens.
    fetchPolicy: 'cache-and-network',
  })
  const { data: scopeFeaturesData } = useQuery(SCOPE_FEATURES_FOR_PROJECT, {
    variables: { projectId: project.id, perPage: 100 },
  })
  const [dispatchRun, { loading: dispatching, error: dispatchError }] = useMutation(DISPATCH_RUN)

  const approvedFeatures = (scopeFeaturesData?.scopeFeaturesForProject?.allData || []).filter(
    (feature) => feature.approved
  )

  const handleDispatch = async (e) => {
    e.preventDefault()
    await dispatchRun({ variables: form })
    SweetAlert('Run dispatched')
    setForm({ scopeFeatureId: '', roleName: '' })
    refetch()
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
    setPage(1)
  }

  const runs = data?.runsForProject?.allData || []

  return (
    <div>
      <Card className="mb-4">
        <Card.Body>
          <div className="text-16 semibold mb-3">Dispatch a run</div>
          <ErrorComponent error={dispatchError} />
          {approvedFeatures.length === 0 ? (
            <div className="text-14 text-gray-600">
              Approve a scope feature before you can dispatch a run.
            </div>
          ) : (
            <form onSubmit={handleDispatch} className="d-flex gap-2 align-items-end">
              <div style={{ flex: 2 }}>
                <SelectField
                  label="Scope feature"
                  name="scopeFeatureId"
                  value={form.scopeFeatureId}
                  onChange={(e) => HandleChange(e, setForm)}
                  includeBlank
                  blankLabel="Select..."
                  options={approvedFeatures.map((feature) => ({
                    value: feature.id,
                    label: feature.name,
                  }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <InputField
                  label="Role"
                  name="roleName"
                  placeholder="admin"
                  value={form.roleName}
                  onChange={(e) => HandleChange(e, setForm)}
                  required
                />
              </div>
              <ButtonComponent
                type="submit"
                loading={dispatching}
                disabled={!form.scopeFeatureId}
                className="mb-3"
              >
                Dispatch
              </ButtonComponent>
            </form>
          )}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-16 semibold">Run queue</div>
        <div style={{ width: '200px' }}>
          <SelectField
            name="status"
            value={status}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {loading && !data ? (
        <Loading />
      ) : (
        <>
          <ErrorComponent error={error} />
          {runs.length === 0 ? (
            <EmptyState title="No runs yet" />
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Scope feature</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Finished</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <Fragment key={run.id}>
                    <tr onClick={() => setOpenRunId(openRunId === run.id ? null : run.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        {openRunId === run.id ? '▾' : '▸'} {run.scopeFeature?.name}
                      </td>
                      <td>{run.roleName}</td>
                      <td>
                        <RunStatusBadge status={run.status} />
                      </td>
                      <td>{run.startedAt ? new Date(run.startedAt).toLocaleString() : '—'}</td>
                      <td>{run.finishedAt ? new Date(run.finishedAt).toLocaleString() : '—'}</td>
                    </tr>
                    {openRunId === run.id && (
                      <tr>
                        <td colSpan={5} className="bg-light">
                          <RunDetail runId={run.id} projectId={project.id} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </Table>
          )}
          <PaginationBar
            page={page}
            totalPages={data?.runsForProject?.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
