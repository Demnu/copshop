import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface InfoPillProps {
  icon?: ReactNode
  label: string | ReactNode
}

export function InfoPill({ icon, label }: InfoPillProps) {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}
    >
      {icon && (
        <Box
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </Box>
      )}
      {typeof label === 'string' ? (
        <Typography
          variant="body1"
          fontWeight="medium"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          {label}
        </Typography>
      ) : (
        label
      )}
    </Box>
  )
}
