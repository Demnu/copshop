import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Typography, Alert, Button } from '@mui/material'
import { getPoliceOfficerById } from '@/data/policeOfficers/getPoliceOfficerById'
import { PoliceOfficerDetailPageUK } from '@/pages/PoliceOfficerDetailPageUK/PoliceOfficerDetailPageUK'
export const Route = createFileRoute('/police-officers/$officerId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const officer = await getPoliceOfficerById({
      data: { officerId: Number(params.officerId) },
    })
    if (!officer) {
      throw new Error('Police officer not found')
    }
    return { officer }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.officer) {
      return {
        meta: [
          {
            title: 'Officer Not Found - CopShop',
          },
        ],
      }
    }

    const officer = loaderData.officer
    const name =
      [officer.firstName, officer.lastName].filter(Boolean).join(' ') ||
      'Unknown Officer'
    return {
      meta: [
        {
          title: `${name} - Police Officer - CopShop`,
        },
        {
          name: 'description',
          content: `View and manage police officer ${name}.`,
        },
      ],
    }
  },
  errorComponent: ({ error }) => (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Alert severity="error">
        <Typography variant="h6">Error</Typography>
        <Typography>{error.message || 'Police officer not found'}</Typography>
        <Button component={Link} to="/police-officers" sx={{ mt: 2 }}>
          Back to Officers
        </Button>
      </Alert>
    </Container>
  ),
})

function RouteComponent() {
  const { officer } = Route.useLoaderData()
  return <PoliceOfficerDetailPageUK officer={officer} />
}
