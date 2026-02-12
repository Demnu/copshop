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
  MenuItem,
  FormControl,
  Select,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  getPoliceOfficerById,
  deletePoliceOfficer,
  updatePoliceOfficer,
} from '@/data/policeOfficers/policeOfficerService'
import { getAllOrganizations } from '@/data/organizations/organizationService'
import { sendOfficerComplaint } from '@/data/serverFunctions'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MutationError } from '@/components/MutationError'
import { queryKeys } from '@/lib/queryKeys'
import { VerificationStatus } from '@/data/schema'
import type { VerificationStatus as VerificationStatusType } from '@/data/schema'

export const Route = createFileRoute('/police-officers/$officerId')({
  component: PoliceOfficerDetailPage,
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

function PoliceOfficerDetailPage() {
  const { officer } = Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  // Complaint dialog state
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false)
  const [complainantName, setComplainantName] = useState('')
  const [complainantEmail, setComplainantEmail] = useState('')
  const [complaintMessage, setComplaintMessage] = useState('')

  const [editedFirstName, setEditedFirstName] = useState(
    officer.firstName || '',
  )
  const [editedLastName, setEditedLastName] = useState(officer.lastName || '')
  const [editedBadgeNumber, setEditedBadgeNumber] = useState(
    officer.badgeNumber || '',
  )
  const [editedRank, setEditedRank] = useState(officer.rank || '')
  const [editedOrganizationId, setEditedOrganizationId] = useState<
    number | undefined
  >(officer.organizationId || undefined)
  const [editedVerificationStatus, setEditedVerificationStatus] =
    useState<VerificationStatusType>(officer.verificationStatus)
  const [editedEstimatedDob, setEditedEstimatedDob] = useState(
    officer.estimatedDob || '',
  )

  const { data: organizations } = useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => getAllOrganizations(),
  })

  const updateOfficerMutation = useMutation({
    mutationFn: (data: {
      officerId: number
      firstName?: string
      lastName?: string
      badgeNumber?: string
      rank?: string
      organizationId?: number | null
      verificationStatus?: VerificationStatusType
      estimatedDob?: string
    }) => updatePoliceOfficer({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policeOfficers.all })
      setIsEditing(false)
      router.invalidate()
    },
  })

  const deleteOfficerMutation = useMutation({
    mutationFn: (officerId: number) =>
      deletePoliceOfficer({ data: { officerId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policeOfficers.all })
      router.navigate({ to: '/police-officers' })
    },
  })

  const complaintMutation = useMutation({
    mutationFn: (data: {
      officerId: number
      complainantName: string
      complainantEmail: string
      complaintMessage: string
    }) => sendOfficerComplaint({ data }),
    onSuccess: () => {
      setComplaintDialogOpen(false)
      setComplainantName('')
      setComplainantEmail('')
      setComplaintMessage('')
    },
  })

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedFirstName(officer.firstName || '')
      setEditedLastName(officer.lastName || '')
      setEditedBadgeNumber(officer.badgeNumber || '')
      setEditedRank(officer.rank || '')
      setEditedOrganizationId(officer.organizationId || undefined)
      setEditedVerificationStatus(officer.verificationStatus)
      setEditedEstimatedDob(officer.estimatedDob || '')
      updateOfficerMutation.reset()
    }
    setIsEditing(!isEditing)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    updateOfficerMutation.mutate({
      officerId: officer.id,
      firstName: editedFirstName || undefined,
      lastName: editedLastName || undefined,
      badgeNumber: editedBadgeNumber || undefined,
      rank: editedRank || undefined,
      organizationId: editedOrganizationId,
      verificationStatus: editedVerificationStatus,
      estimatedDob: editedEstimatedDob || undefined,
    })
  }

  const handleDelete = () => {
    const officerName =
      [officer.firstName, officer.lastName].filter(Boolean).join(' ') ||
      'this officer'
    if (
      !confirm(
        `Are you sure you want to delete ${officerName}? This action cannot be undone.`,
      )
    )
      return
    deleteOfficerMutation.mutate(officer.id)
  }

  const handleComplaintOpen = () => {
    setComplaintDialogOpen(true)
  }

  const handleComplaintClose = () => {
    setComplaintDialogOpen(false)
    complaintMutation.reset()
  }

  const handleComplaintSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    complaintMutation.mutate({
      officerId: officer.id,
      complainantName,
      complainantEmail,
      complaintMessage,
    })
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case VerificationStatus.CONFIRMED:
        return 'success'
      case VerificationStatus.SUSPECTED:
        return 'warning'
      default:
        return 'default'
    }
  }

  const officerName =
    [officer.firstName, officer.lastName].filter(Boolean).join(' ') ||
    'Unknown Officer'

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Button
            component={Link}
            to="/police-officers"
            variant="text"
            sx={{ mb: 2 }}
          >
            ← Back to Officers
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {officerName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!isEditing && (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleComplaintOpen}
                  >
                    Send Complaint
                  </Button>
                  <Button variant="outlined" onClick={handleEditToggle}>
                    Edit
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {complaintMutation.isSuccess && (
          <Alert severity="success" onClose={() => complaintMutation.reset()}>
            {complaintMutation.data?.message || 'Complaint sent successfully!'}
          </Alert>
        )}
        {complaintMutation.isError && (
          <MutationError
            error={complaintMutation.error}
            action="send complaint"
          />
        )}
        {updateOfficerMutation.isError && (
          <MutationError
            error={updateOfficerMutation.error}
            action="update officer"
          />
        )}
        {updateOfficerMutation.isSuccess && !isEditing && (
          <Alert severity="success">Officer updated successfully!</Alert>
        )}
        {deleteOfficerMutation.isError && (
          <MutationError
            error={deleteOfficerMutation.error}
            action="delete officer"
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
                    First Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedFirstName}
                      onChange={(e) => setEditedFirstName(e.target.value)}
                      disabled={updateOfficerMutation.isPending}
                    />
                  ) : (
                    <Typography variant="h6">
                      {officer.firstName || '-'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Last Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedLastName}
                      onChange={(e) => setEditedLastName(e.target.value)}
                      disabled={updateOfficerMutation.isPending}
                    />
                  ) : (
                    <Typography variant="h6">
                      {officer.lastName || '-'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Badge Number
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedBadgeNumber}
                      onChange={(e) => setEditedBadgeNumber(e.target.value)}
                      disabled={updateOfficerMutation.isPending}
                    />
                  ) : (
                    <Typography variant="h6">
                      {officer.badgeNumber || '-'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Rank
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedRank}
                      onChange={(e) => setEditedRank(e.target.value)}
                      disabled={updateOfficerMutation.isPending}
                    />
                  ) : (
                    <Typography variant="h6">{officer.rank || '-'}</Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Organization
                  </Typography>
                  {isEditing ? (
                    <FormControl fullWidth>
                      <Select
                        value={editedOrganizationId || ''}
                        onChange={(e) =>
                          setEditedOrganizationId(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        disabled={updateOfficerMutation.isPending}
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
                  ) : (
                    <Typography variant="h6">
                      {'organization' in officer && officer.organization
                        ? officer.organization.name
                        : 'None'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Verification Status
                  </Typography>
                  {isEditing ? (
                    <FormControl fullWidth>
                      <Select
                        value={editedVerificationStatus}
                        onChange={(e) =>
                          setEditedVerificationStatus(
                            e.target.value as VerificationStatusType,
                          )
                        }
                        disabled={updateOfficerMutation.isPending}
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
                  ) : (
                    <Box>
                      <Chip
                        label={officer.verificationStatus}
                        color={getVerificationColor(officer.verificationStatus)}
                        size="small"
                      />
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Estimated Date of Birth
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="date"
                      value={editedEstimatedDob}
                      onChange={(e) => setEditedEstimatedDob(e.target.value)}
                      disabled={updateOfficerMutation.isPending}
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : (
                    <Typography variant="h6">
                      {officer.estimatedDob || '-'}
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Officer ID
                  </Typography>
                  <Chip label={officer.id} size="small" />
                </Box>

                {isEditing && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={updateOfficerMutation.isPending}
                      fullWidth
                    >
                      {updateOfficerMutation.isPending
                        ? 'Saving...'
                        : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleEditToggle}
                      disabled={updateOfficerMutation.isPending}
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
              Deleting this officer is permanent and cannot be undone.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={deleteOfficerMutation.isPending}
            >
              {deleteOfficerMutation.isPending
                ? 'Deleting...'
                : 'Delete Officer'}
            </Button>
          </CardContent>
        </Card>
      </Stack>

      {/* Complaint Dialog */}
      <Dialog
        open={complaintDialogOpen}
        onClose={handleComplaintClose}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleComplaintSubmit}>
          <DialogTitle>Send Complaint About Officer</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Alert severity="info">
                This complaint will be sent to{' '}
                {officer.organizationId
                  ? organizations?.find(
                      (org) => org.id === officer.organizationId,
                    )?.name || 'the organization'
                  : 'the organization'}{' '}
                via email.
              </Alert>
              <TextField
                label="Your Name"
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
                required
                fullWidth
                disabled={complaintMutation.isPending}
              />
              <TextField
                label="Your Email"
                type="email"
                value={complainantEmail}
                onChange={(e) => setComplainantEmail(e.target.value)}
                required
                fullWidth
                disabled={complaintMutation.isPending}
              />
              <TextField
                label="Complaint Details"
                value={complaintMessage}
                onChange={(e) => setComplaintMessage(e.target.value)}
                required
                multiline
                rows={6}
                fullWidth
                disabled={complaintMutation.isPending}
                helperText="Please provide detailed information about your complaint (minimum 10 characters)"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleComplaintClose}
              disabled={complaintMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={complaintMutation.isPending}
            >
              {complaintMutation.isPending ? 'Sending...' : 'Send Complaint'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}
