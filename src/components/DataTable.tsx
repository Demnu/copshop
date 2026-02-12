import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableProps,
} from '@mui/material'
import { ReactNode } from 'react'

export interface Column<T> {
  id: string
  label: string
  align?: 'left' | 'right' | 'center'
  minWidth?: number
  format?: (row: T) => ReactNode
}

interface DataTableProps<T> extends Omit<TableProps, 'children'> {
  columns: Column<T>[]
  data: T[]
  getRowKey: (row: T, index: number) => string | number
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  ...tableProps
}: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table {...tableProps}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={getRowKey(row, index)}
              hover={!!onRowClick}
              onClick={() => onRowClick?.(row)}
              sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => {
                return (
                  <TableCell key={column.id} align={column.align}>
                    {column.format
                      ? column.format(row)
                      : ((row as Record<string, unknown>)[
                          column.id
                        ] as ReactNode)}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
