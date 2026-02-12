import { Box, Typography, BoxProps } from '@mui/material'
import { ReactNode } from 'react'

interface PageHeaderProps extends Omit<BoxProps, 'title'> {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  action,
  ...props
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        ...props.sx,
      }}
      {...props}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom={!!subtitle}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  )
}
