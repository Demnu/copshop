import { Box, Pagination } from '@mui/material'
import { DataCard } from './DataCard'
import { DataTable, Column } from './DataTable'

interface PaginationInfo {
  page: number
  limit: number
  total: number
}

interface PaginatedListProps<T> {
  data: T[]
  columns: Column<T>[]
  pagination: PaginationInfo
  onPageChange: (page: number) => void
  getRowKey: (row: T, index: number) => string | number
  onRowClick?: (row: T) => void
  isLoading?: boolean
  error?: Error | null
  emptyMessage?: string
}

export function PaginatedList<T>({
  data,
  columns,
  pagination,
  onPageChange,
  getRowKey,
  onRowClick,
  isLoading,
  error,
  emptyMessage = 'No data available',
}: PaginatedListProps<T>) {
  const totalPages = Math.ceil(pagination.total / pagination.limit)

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    onPageChange(value)
  }

  return (
    <>
      <DataCard
        isLoading={isLoading}
        error={error}
        isEmpty={data.length === 0}
        emptyMessage={emptyMessage}
      >
        <DataTable
          columns={columns}
          data={data}
          getRowKey={getRowKey}
          onRowClick={onRowClick}
        />
      </DataCard>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </>
  )
}

export function getPaginationSubtitle(
  total: number,
  page: number,
  limit: number,
  itemName: string = 'item',
): string {
  const totalPages = Math.ceil(total / limit)
  const pluralItemName = total === 1 ? itemName : `${itemName}s`
  return `${total} ${pluralItemName} • Page ${page} of ${totalPages}`
}
