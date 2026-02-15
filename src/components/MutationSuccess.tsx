import { Alert } from '@mui/material'

interface MutationSuccessProps {
  successMessage: string
  onClose?: () => void
}

export function MutationSuccess({
  successMessage,
  onClose,
}: MutationSuccessProps) {
  return (
    <Alert severity="success" sx={{ borderRadius: 2 }} onClose={onClose}>
      {successMessage}
    </Alert>
  )
}
