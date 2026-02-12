import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material'
import { ReactNode } from 'react'

interface DataCardProps {
  children: ReactNode
  isLoading?: boolean
  error?: Error | null
  emptyMessage?: string
  isEmpty?: boolean
}

export function DataCard({
  children,
  isLoading,
  error,
  emptyMessage = 'No data available',
  isEmpty,
}: DataCardProps) {
  return (
    <Card>
      <CardContent>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error">
            Error: {error.message || 'Failed to load data'}
          </Typography>
        )}
        {!isLoading && !error && isEmpty && (
          <Typography color="text.secondary">{emptyMessage}</Typography>
        )}
        {!isLoading && !error && !isEmpty && children}
      </CardContent>
    </Card>
  )
}
