import { Button } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import type { MouseEventHandler } from 'react'

interface FormCancelButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  fullWidth?: boolean
  label?: string
}

export const FormCancelButton = (props: FormCancelButtonProps) => {
  const { onClick, disabled, fullWidth, label = 'Cancel' } = props
  return (
    <Button
      type="button"
      variant="outlined"
      size="large"
      startIcon={<CloseIcon />}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {label}
    </Button>
  )
}
