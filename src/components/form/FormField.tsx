import { Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  children: ReactNode
}

export const FormField = ({ label, children }: FormFieldProps) => {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      {children}
    </Stack>
  )
}
