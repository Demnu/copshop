import { createFileRoute, Link } from '@tanstack/react-router'
import { Container, Typography, Alert, Button } from '@mui/material'
import { getOrganizationById } from '@/data/organizations/getOrganizationById'
import { OrganizationDetailPageUK } from '@/pages/OrganizationDetailPageUK/OrganizationDetailPageUK'

export const Route = createFileRoute('/organizations/$organizationId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const organization = await getOrganizationById({
      data: { organizationId: Number(params.organizationId) },
    })
    if (!organization) {
      throw new Error('Organization not found')
    }
    return { organization }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.organization) {
      return {
        meta: [
          {
            title: 'Organization Not Found - CopShop',
          },
        ],
      }
    }

    const organization = loaderData.organization
    return {
      meta: [
        {
          title: `${organization.name} - Organization - CopShop`,
        },
        {
          name: 'description',
          content: `View and manage organization ${organization.name}.`,
        },
      ],
    }
  },
  errorComponent: ({ error }) => (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Alert severity="error">
        <Typography variant="h6">Error</Typography>
        <Typography>{error.message || 'Organization not found'}</Typography>
        <Button component={Link} to="/organizations" sx={{ mt: 2 }}>
          Back to Organizations
        </Button>
      </Alert>
    </Container>
  ),
})

function RouteComponent() {
  const { organization } = Route.useLoaderData()
  return <OrganizationDetailPageUK organization={organization} />
}
