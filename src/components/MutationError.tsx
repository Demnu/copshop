import { Alert, Typography } from '@mui/material'

interface MutationErrorProps {
  error: unknown
  action?: string
}

export function MutationError({
  error,
  action = 'perform action',
}: MutationErrorProps) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An unexpected error occurred. Please try again.'

  return (
    <Alert severity="error">
      <Typography variant="subtitle2" gutterBottom>
        Failed to {action}
      </Typography>
      <Typography variant="body2">{errorMessage}</Typography>
    </Alert>
  )
}
