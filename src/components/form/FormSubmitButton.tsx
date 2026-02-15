import { Button } from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'

interface FormSubmitButtonProps {
  isPending?: boolean
  disabled?: boolean
  fullWidth?: boolean
  label?: string
  pendingLabel?: string
  onClick?: () => void
  form?: string
}

export const FormSubmitButton = (props: FormSubmitButtonProps) => {
  const {
    isPending = false,
    disabled,
    fullWidth = true,
    label = 'Save Changes',
    pendingLabel = 'Saving...',
    onClick,
    form,
  } = props

  const isDisabled = disabled ?? isPending

  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      startIcon={<CheckIcon />}
      disabled={isDisabled}
      fullWidth={fullWidth}
      onClick={onClick}
      form={form}
    >
      {isPending ? pendingLabel : label}
    </Button>
  )
}
