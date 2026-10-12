import { Icon } from './Icon'

export const EmptyState = ({ title = 'Nothing here yet', description = '' }) => {
  return (
    <div className="qa-empty">
      <div className="qa-empty-icon">
        <Icon name="inbox" size={22} strokeWidth={1.75} />
      </div>
      <div className="qa-empty-title">{title}</div>
      {description && <div className="text-14 regular">{description}</div>}
    </div>
  )
}
