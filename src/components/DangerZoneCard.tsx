import { Card, CardContent, Box, Typography, Button } from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'

interface DangerZoneCardProps {
  title?: string
  description?: string
  actionLabel: string
  onAction: () => void
  isPending?: boolean
  icon?: React.ReactNode
}

export function DangerZoneCard({
  title = 'Danger Zone',
  description = 'This action is permanent and cannot be undone.',
  actionLabel,
  onAction,
  isPending = false,
  icon,
}: DangerZoneCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '2px solid',
        borderColor: 'error.main',
        bgcolor: 'error.50',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon || <WarningIcon color="error" />}
            <Box>
              <Typography variant="h6" color="error" fontWeight="bold">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="error"
            onClick={onAction}
            disabled={isPending}
            size="large"
          >
            {actionLabel}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
