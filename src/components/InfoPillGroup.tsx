import { Stack } from '@mui/material'
import type { ReactNode } from 'react'

interface InfoPillGroupProps {
  children: ReactNode
  spacing?: number
}

export function InfoPillGroup({ children, spacing = 3 }: InfoPillGroupProps) {
  return (
    <Stack
      direction="row"
      spacing={spacing}
      sx={{
        flexWrap: 'wrap',
        gap: { xs: 0.5, sm: 1 },
        justifyContent: { xs: 'center', sm: 'flex-start' },
      }}
    >
      {children}
    </Stack>
  )
}
