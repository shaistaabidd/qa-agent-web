import { Link } from 'react-router-dom'
import { Icon } from './Icon'

export const PageHeader = ({ title, subtitle, actions, backTo, backLabel, badge, children }) => (
  <div className="qa-page-header">
    <div className="min-w-0">
      {backTo && (
        <Link to={backTo} className="qa-back-link">
          <Icon name="arrowLeft" size={14} />
          {backLabel}
        </Link>
      )}
      <h1 className="qa-page-title">
        {title}
        {badge}
      </h1>
      {subtitle && <div className="qa-page-subtitle">{subtitle}</div>}
      {children}
    </div>
    {actions && <div className="d-flex gap-2 align-items-center">{actions}</div>}
  </div>
)
