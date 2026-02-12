import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  Button,
  Alert,
  TextField,
  Chip,
} from '@mui/material'
import {
  getOrganizationById,
  deleteOrganization,
  updateOrganization,
} from '@/data/organizations/organizationService'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MutationError } from '@/components/MutationError'
import { queryKeys } from '@/lib/queryKeys'
import { LocationMap } from '@/components/LocationMap'

export const Route = createFileRoute('/organizations/$organizationId')({
  component: OrganizationDetailPage,
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

    const org = loaderData.organization
    return {
      meta: [
        {
          title: `${org.name} - Organization - CopShop`,
        },
        {
          name: 'description',
          content: `View and manage ${org.name} organization.`,
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

function OrganizationDetailPage() {
  const { organization } = Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(organization.name)
  const [editedAddress, setEditedAddress] = useState(organization.address || '')
  const [editedEmail, setEditedEmail] = useState(organization.email || '')
  const [editedContactNumber, setEditedContactNumber] = useState(
    organization.contactNumber || '',
  )

  const updateOrganizationMutation = useMutation({
    mutationFn: (data: {
      organizationId: number
      name: string
      address?: string
      email?: string
      contactNumber?: string
    }) => updateOrganization({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all })
      setIsEditing(false)
      router.invalidate()
    },
  })

  const deleteOrganizationMutation = useMutation({
    mutationFn: (organizationId: number) =>
      deleteOrganization({ data: { organizationId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all })
      router.navigate({ to: '/organizations' })
    },
  })

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedName(organization.name)
      setEditedAddress(organization.address || '')
      setEditedEmail(organization.email || '')
      setEditedContactNumber(organization.contactNumber || '')
      updateOrganizationMutation.reset()
    }
    setIsEditing(!isEditing)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editedName) return

    updateOrganizationMutation.mutate({
      organizationId: organization.id,
      name: editedName,
      address: editedAddress || undefined,
      email: editedEmail || undefined,
      contactNumber: editedContactNumber || undefined,
    })
  }

  const handleDelete = () => {
    if (
      !confirm(
        `Are you sure you want to delete ${organization.name}? This action cannot be undone.`,
      )
    )
      return
    deleteOrganizationMutation.mutate(organization.id)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Button
            component={Link}
            to="/organizations"
            variant="text"
            sx={{ mb: 2 }}
          >
            ← Back to Organizations
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {organization.name}
            </Typography>
            <Box>
              {!isEditing && (
                <Button variant="outlined" onClick={handleEditToggle}>
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {updateOrganizationMutation.isError && (
          <MutationError
            error={updateOrganizationMutation.error}
            action="update organization"
          />
        )}
        {updateOrganizationMutation.isSuccess && !isEditing && (
          <Alert severity="success">Organization updated successfully!</Alert>
        )}
        {deleteOrganizationMutation.isError && (
          <MutationError
            error={deleteOrganizationMutation.error}
            action="delete organization"
          />
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Organization Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      required
                      disabled={updateOrganizationMutation.isPending}
                    />
                  ) : (
                    <Typography variant="h6">{organization.name}</Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Organization ID
                  </Typography>
                  <Chip label={organization.id} size="small" />
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Email
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      disabled={updateOrganizationMutation.isPending}
                      placeholder="organization@example.com"
                    />
                  ) : (
                    <Typography variant="body1">
                      {organization.email || 'Not set'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Contact Number
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedContactNumber}
                      onChange={(e) => setEditedContactNumber(e.target.value)}
                      disabled={updateOrganizationMutation.isPending}
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <Typography variant="body1">
                      {organization.contactNumber || 'Not set'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Address
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      disabled={updateOrganizationMutation.isPending}
                      placeholder="123 Main St, City, State, Country"
                      multiline
                      rows={2}
                    />
                  ) : (
                    <Typography variant="body1">
                      {organization.address || 'Not set'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Location Map
                  </Typography>
                  <LocationMap
                    latitude={organization.latitude}
                    longitude={organization.longitude}
                    editable={false}
                  />
                  {!organization.latitude && !organization.longitude && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {organization.address
                        ? 'Map will appear after saving'
                        : 'Set an address to show location'}
                    </Typography>
                  )}
                </Box>

                {isEditing && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        updateOrganizationMutation.isPending || !editedName
                      }
                      fullWidth
                    >
                      {updateOrganizationMutation.isPending
                        ? 'Saving...'
                        : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleEditToggle}
                      disabled={updateOrganizationMutation.isPending}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Stack>
            </form>
          </CardContent>
        </Card>

        <Card sx={{ borderColor: 'error.main', borderWidth: 1 }}>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Deleting this organization is permanent and cannot be undone.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={deleteOrganizationMutation.isPending}
            >
              {deleteOrganizationMutation.isPending
                ? 'Deleting...'
                : 'Delete Organization'}
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
