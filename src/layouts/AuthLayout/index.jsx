import { Outlet } from 'react-router-dom'
import { BrandMark, Icon } from '@components/index'

const POINTS = [
  ['Real-browser test runs', 'log in as each role and explore your app like a user would.'],
  ['Sentry-style issues', 'stack traces, breadcrumbs and repro steps, grouped across runs.'],
  ['Backend insight', 'N+1 queries, slow SQL, swallowed exceptions and memory growth.'],
]

export const AuthLayout = () => {
  return (
    <div className="qa-auth">
      <section className="qa-auth-brand">
        <div className="qa-brand">
          <BrandMark size={34} />
          <span>
            QA Agent
            <small>Automated QA</small>
          </span>
        </div>

        <div>
          <div className="qa-auth-headline">Catch what breaks before your users do.</div>
          <ul className="qa-auth-points">
            {POINTS.map(([title, text]) => (
              <li key={title}>
                <Icon name="check" size={18} />
                <span>
                  <strong>{title}</strong> — {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="qa-auth-foot">© {new Date().getFullYear()} QA Agent</div>
      </section>

      <section className="qa-auth-form">
        <div className="qa-auth-card">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
