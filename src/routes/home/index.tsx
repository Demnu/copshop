import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Grid,
} from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import BadgeIcon from '@mui/icons-material/Badge'
import EventIcon from '@mui/icons-material/Event'
import VideoIcon from '@mui/icons-material/VideoLibrary'

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'CopShop - Police Accountability Tracker',
      },
      {
        name: 'description',
        content:
          'Track and document police officer behavior and accountability.',
      },
    ],
  }),
})

function RouteComponent() {
  const sections = [
    {
      title: 'Organizations',
      description: 'Manage police departments and organizations',
      icon: <BusinessIcon sx={{ fontSize: 48 }} />,
      link: '/organizations',
      color: '#1976d2',
    },
    {
      title: 'Police Officers',
      description: 'Track police officer information and assignments',
      icon: <BadgeIcon sx={{ fontSize: 48 }} />,
      link: '/police-officers',
      color: '#2e7d32',
    },
    {
      title: 'Events',
      description: 'Document and track incidents and events',
      icon: <EventIcon sx={{ fontSize: 48 }} />,
      link: '/events',
      color: '#ed6c02',
      disabled: true,
    },
    {
      title: 'Media',
      description: 'Manage photos and videos as evidence',
      icon: <VideoIcon sx={{ fontSize: 48 }} />,
      link: '/media',
      color: '#9c27b0',
      disabled: true,
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          CopShop
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Police Accountability Tracker
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid size={{ xs: 12, sm: 6, md: 6 }} key={section.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: section.disabled ? 0.6 : 1,
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: section.color, mb: 2 }}>{section.icon}</Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {section.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  component={Link}
                  to={section.link}
                  variant="contained"
                  disabled={section.disabled}
                  sx={{ backgroundColor: section.color }}
                >
                  {section.disabled ? 'Coming Soon' : 'View'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
