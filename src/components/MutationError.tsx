import { Alert, Typography } from '@mui/material'

interface MutationErrorProps {
  error: unknown
  errorMessage: string
}

export function MutationError({ error, errorMessage }: MutationErrorProps) {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An unexpected error occurred. Please try again.'

  return (
    <Alert severity="error" sx={{ borderRadius: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Failed to {errorMessage}
      </Typography>
      <Typography variant="body2">{msg}</Typography>
    </Alert>
  )
}
