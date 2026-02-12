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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { createPoliceOfficer } from '@/data/policeOfficers/policeOfficerService'
import { getAllOrganizations } from '@/data/organizations/organizationService'
import { VerificationStatus } from '@/data/schema'
import type { VerificationStatus as VerificationStatusType } from '@/data/schema'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MutationError } from '@/components/MutationError'
import { queryKeys } from '@/lib/queryKeys'

export const Route = createFileRoute('/police-officers/new')({
  component: CreatePoliceOfficerPage,
  head: () => ({
    meta: [
      {
        title: 'Create Police Officer - CopShop',
      },
      {
        name: 'description',
        content: 'Create a new police officer record.',
      },
    ],
  }),
})

function CreatePoliceOfficerPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [badgeNumber, setBadgeNumber] = useState('')
  const [rank, setRank] = useState('')
  const [organizationId, setOrganizationId] = useState<number | undefined>(
    undefined,
  )
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatusType>(VerificationStatus.UNVERIFIED)
  const [estimatedDob, setEstimatedDob] = useState('')

  const { data: organizations } = useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => getAllOrganizations(),
  })

  const createOfficerMutation = useMutation({
    mutationFn: (data: {
      firstName?: string
      lastName?: string
      badgeNumber?: string
      rank?: string
      organizationId?: number
      verificationStatus?: VerificationStatusType
      estimatedDob?: string
    }) => createPoliceOfficer({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.policeOfficers.lists(),
      })
      router.navigate({ to: '/police-officers' })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createOfficerMutation.mutate({
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      badgeNumber: badgeNumber.trim() || undefined,
      rank: rank.trim() || undefined,
      organizationId,
      verificationStatus,
      estimatedDob: estimatedDob || undefined,
    })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Police Officer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add a new police officer record to the database.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  autoFocus
                />
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                />
              </Stack>

              <TextField
                label="Badge Number"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                fullWidth
                placeholder="e.g., 12345"
              />

              <TextField
                label="Rank"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                fullWidth
                placeholder="e.g., Sergeant, Officer, Lieutenant"
              />

              <FormControl fullWidth>
                <InputLabel>Organization</InputLabel>
                <Select
                  value={organizationId || ''}
                  onChange={(e) =>
                    setOrganizationId(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  label="Organization"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {organizations?.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Verification Status</InputLabel>
                <Select
                  value={verificationStatus}
                  onChange={(e) =>
                    setVerificationStatus(
                      e.target.value as VerificationStatusType,
                    )
                  }
                  label="Verification Status"
                >
                  <MenuItem value={VerificationStatus.UNVERIFIED}>
                    Unverified
                  </MenuItem>
                  <MenuItem value={VerificationStatus.SUSPECTED}>
                    Suspected
                  </MenuItem>
                  <MenuItem value={VerificationStatus.CONFIRMED}>
                    Confirmed
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Estimated Date of Birth"
                type="date"
                value={estimatedDob}
                onChange={(e) => setEstimatedDob(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              {createOfficerMutation.error && (
                <MutationError
                  error={createOfficerMutation.error}
                  action="create police officer"
                />
              )}

              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createOfficerMutation.isPending}
                >
                  {createOfficerMutation.isPending
                    ? 'Creating...'
                    : 'Create Officer'}
                </Button>
                <Button
                  component={Link}
                  to="/police-officers"
                  variant="outlined"
                  disabled={createOfficerMutation.isPending}
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
