import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="text-center py-5">
      <div className="text-24 semibold mb-2">Page not found</div>
      <Link to="/projects">Back to projects</Link>
    </div>
  )
}
