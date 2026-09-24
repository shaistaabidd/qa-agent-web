import Badge from 'react-bootstrap/Badge'

const RUN_STATUS_VARIANTS = {
  QUEUED: 'secondary',
  RUNNING: 'info',
  BLOCKED: 'warning',
  COMPLETED: 'success',
  FAILED: 'danger',
}

const SEVERITY_VARIANTS = {
  LOW: 'secondary',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'danger',
}

export const RunStatusBadge = ({ status }) => (
  <Badge bg={RUN_STATUS_VARIANTS[status] || 'secondary'}>{status}</Badge>
)

export const SeverityBadge = ({ severity }) => (
  <Badge bg={SEVERITY_VARIANTS[severity] || 'secondary'}>{severity}</Badge>
)
