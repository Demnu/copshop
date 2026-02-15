import { Box, Container, Stack } from '@mui/material'
import type { ReactNode } from 'react'

interface DetailPageLayoutProps {
  hero?: ReactNode
  children: ReactNode
}

export function DetailPageLayout({ hero, children }: DetailPageLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      {hero}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3 }}>
          <Stack spacing={3}>{children}</Stack>
        </Box>
      </Container>
    </Box>
  )
}
