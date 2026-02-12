import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Box,
} from '@mui/material'
import { createOrganization } from '@/data/organizations/organizationService'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MutationError } from '@/components/MutationError'
import { queryKeys } from '@/lib/queryKeys'

export const Route = createFileRoute('/organizations/new')({
  component: CreateOrganizationPage,
  head: () => ({
    meta: [
      {
        title: 'Create Organization - CopShop',
      },
      {
        name: 'description',
        content: 'Create a new police organization.',
      },
    ],
  }),
})

function CreateOrganizationPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')

  const createOrgMutation = useMutation({
    mutationFn: (data: {
      name: string
      address?: string
      email?: string
      contactNumber?: string
    }) => createOrganization({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.lists(),
      })
      router.navigate({ to: '/organizations' })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return

    createOrgMutation.mutate({
      name: name.trim(),
      address: address || undefined,
      email: email || undefined,
      contactNumber: contactNumber || undefined,
    })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Organization
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add a new police department or organization.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Organization Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                placeholder="e.g., Los Angeles Police Department"
                autoFocus
              />

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                placeholder="contact@organization.com"
              />

              <TextField
                label="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                fullWidth
                placeholder="+1 (555) 123-4567"
              />

              <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                placeholder="123 Main St, City, State, Country"
                multiline
                rows={2}
                helperText="Location will be automatically geocoded when saved"
              />

              {createOrgMutation.error && (
                <MutationError
                  error={createOrgMutation.error}
                  action="create organization"
                />
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createOrgMutation.isPending || !name.trim()}
                >
                  {createOrgMutation.isPending
                    ? 'Creating...'
                    : 'Create Organization'}
                </Button>
                <Button
                  component={Link}
                  to="/organizations"
                  variant="outlined"
                  disabled={createOrgMutation.isPending}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}
