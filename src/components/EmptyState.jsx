export const EmptyState = ({ title = 'Nothing here yet', description = '' }) => {
  return (
    <div className="text-center py-5 text-gray-600">
      <div className="text-16 semibold mb-1">{title}</div>
      {description && <div className="text-14 regular">{description}</div>}
    </div>
  )
}
