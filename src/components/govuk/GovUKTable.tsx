import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
}

interface GovUKTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  getRowKey: (item: T) => string | number
}

export function GovUKTable<T>({
  columns,
  data,
  onRowClick,
  getRowKey,
}: GovUKTableProps<T>) {
  return (
    <table className="govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          {columns.map((column) => (
            <th key={column.key} scope="col" className="govuk-table__header">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {data.length === 0 ? (
          <tr className="govuk-table__row">
            <td
              colSpan={columns.length}
              className="govuk-table__cell"
              style={{ textAlign: 'center', padding: '40px' }}
            >
              No records found
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr
              key={getRowKey(item)}
              className="govuk-table__row"
              onClick={() => onRowClick?.(item)}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} className="govuk-table__cell">
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
