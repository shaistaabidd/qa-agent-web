import Alert from 'react-bootstrap/Alert'

export const ErrorComponent = ({ error }) => {
  if (!error) return null

  return <Alert variant="danger">{error.message}</Alert>
}
