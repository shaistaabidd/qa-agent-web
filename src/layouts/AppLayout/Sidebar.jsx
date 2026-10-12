import { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@apollo/client/react'
import { ME } from '@graphql/queries/auth'
import { logoutThunk, userData } from '@store/authSlice'
import { BrandMark, Icon } from '@components/index'

export const Sidebar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  // The user is only in the store right after logging in; after a reload,
  // fetch it so the sidebar can still show who's signed in.
  const { data } = useQuery(ME, { skip: Boolean(user) })
  useEffect(() => {
    if (data?.me) dispatch(userData(data.me))
  }, [data, dispatch])
  const email = user?.email || data?.me?.email

  return (
    <aside className="qa-sidebar">
      <Link to="/projects" className="qa-brand">
        <BrandMark size={30} />
        <span>
          QA Agent
          <small>Automated QA</small>
        </span>
      </Link>

      <nav className="d-flex flex-column gap-1">
        <div className="qa-nav-label">Workspace</div>
        <NavLink to="/projects" className="qa-nav-link">
          <Icon name="projects" size={17} />
          Projects
        </NavLink>
      </nav>

      <div className="qa-user">
        <div className="qa-avatar">{(email || 'QA').slice(0, 2)}</div>
        <div className="min-w-0 flex-grow-1">
          {email && <div className="qa-user-email" title={email}>{email}</div>}
          <button type="button" className="qa-logout d-inline-flex align-items-center gap-1" onClick={() => dispatch(logoutThunk())}>
            <Icon name="logout" size={13} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  )
}
