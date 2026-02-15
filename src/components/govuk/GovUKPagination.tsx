import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function GovUKPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | 'ellipsis')[] = []

  // Always show first page
  pages.push(1)

  // Show pages around current page
  if (currentPage > 3) {
    pages.push('ellipsis')
  }

  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    pages.push(i)
  }

  // Show ellipsis if needed
  if (currentPage < totalPages - 2) {
    pages.push('ellipsis')
  }

  // Always show last page if there is one
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return (
    <nav
      className="govuk-pagination"
      role="navigation"
      aria-label="Pagination"
      style={{ marginTop: '30px' }}
    >
      <div className="govuk-pagination__prev">
        {currentPage > 1 && (
          <button
            className="govuk-link govuk-pagination__link"
            onClick={() => onPageChange(currentPage - 1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            <svg
              className="govuk-pagination__icon govuk-pagination__icon--prev"
              xmlns="http://www.w3.org/2000/svg"
              height="13"
              width="15"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 15 13"
            >
              <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z" />
            </svg>
            <span className="govuk-pagination__link-title">Previous</span>
          </button>
        )}
      </div>

      <ul className="govuk-pagination__list">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <li
              key={`ellipsis-${index}`}
              className="govuk-pagination__item govuk-pagination__item--ellipses"
            >
              ⋯
            </li>
          ) : (
            <li
              key={page}
              className={`govuk-pagination__item ${
                page === currentPage ? 'govuk-pagination__item--current' : ''
              }`}
            >
              <button
                className="govuk-link govuk-pagination__link"
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: page === currentPage ? 'none' : 'underline',
                  fontWeight: page === currentPage ? 'bold' : 'normal',
                }}
              >
                {page}
              </button>
            </li>
          ),
        )}
      </ul>

      <div className="govuk-pagination__next">
        {currentPage < totalPages && (
          <button
            className="govuk-link govuk-pagination__link"
            onClick={() => onPageChange(currentPage + 1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            <span className="govuk-pagination__link-title">Next</span>
            <svg
              className="govuk-pagination__icon govuk-pagination__icon--next"
              xmlns="http://www.w3.org/2000/svg"
              height="13"
              width="15"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 15 13"
            >
              <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  )
}
