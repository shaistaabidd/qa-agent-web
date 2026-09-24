import Spinner from 'react-bootstrap/Spinner'

export const Loading = ({ height = '200' }) => {
  return (
    <div
      className="d-flex align-items-center justify-content-center w-100"
      style={{ minHeight: `${height}px` }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  )
}
