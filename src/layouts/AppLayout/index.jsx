import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const AppLayout = () => {
  return (
    <div className="qa-shell">
      <Sidebar />
      <main className="qa-main">
        <div className="qa-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
