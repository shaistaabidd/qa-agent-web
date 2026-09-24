import { Navigate, BrowserRouter, useRoutes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthLayout, AppLayout } from '@layouts/index'
import { Login, Register, ProjectsList, ProjectDetail, NotFound } from '@pages/index'

// Unlike a multi-role app, there's only one kind of authenticated user here
// (per-project admin/member is a membership detail, not a distinct portal),
// so the route tree only ever branches on isAuthenticated — no role-based
// route-factory layer needed.
const authRoutes = () => [
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]

const appRoutes = () => [
  {
    element: <AppLayout />,
    children: [
      { path: '/projects', element: <ProjectsList /> },
      { path: '/projects/:id', element: <ProjectDetail /> },
      { path: '/', element: <Navigate to="/projects" replace /> },
      { path: '/login', element: <Navigate to="/projects" replace /> },
      { path: '/register', element: <Navigate to="/projects" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const routeElement = useRoutes(isAuthenticated ? appRoutes() : authRoutes())
  return routeElement
}

const Routers = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default Routers
