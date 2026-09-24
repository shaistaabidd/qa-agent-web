import Pagination from 'react-bootstrap/Pagination'

export const PaginationBar = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <Pagination className="mt-3">
      <Pagination.Prev disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <Pagination.Item
          key={pageNumber}
          active={pageNumber === page}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </Pagination.Item>
      ))}
      <Pagination.Next disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
    </Pagination>
  )
}
