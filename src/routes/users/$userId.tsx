import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  Chip,
  Button,
  Alert,
  TextField,
  Avatar,
} from '@mui/material'
import { getUserById, deleteUser, updateUser } from '@/data/users/userService'
import { uploadAvatar } from '@/data/fileService'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from '@/components/MutationError'

export const Route = createFileRoute('/users/$userId')({
  component: UserDetailPage,
  loader: async ({ params }) => {
    const user = await getUserById({ data: { userId: params.userId } })
    if (!user) {
      throw new Error('User not found')
    }
    return { user }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.user) {
      return {
        meta: [
          {
            title: 'User Not Found - CopShop',
          },
        ],
      }
    }

    const user = loaderData.user
    return {
      meta: [
        {
          title: `${user.name} - User Profile - CopShop`,
        },
        {
          name: 'description',
          content: `View profile information for ${user.name} (${user.email}).`,
        },
        {
          property: 'og:title',
          content: `${user.name} - User Profile`,
        },
        {
          property: 'og:description',
          content: `Profile information for ${user.name}`,
        },
        {
          property: 'og:type',
          content: 'profile',
        },
      ],
    }
  },
  errorComponent: ({ error }) => (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Alert severity="error">
        <Typography variant="h6">Error</Typography>
        <Typography>{error.message || 'User not found'}</Typography>
        <Button component={Link} to="/users" sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </Alert>
    </Container>
  ),
})

function UserDetailPage() {
  const { user } = Route.useLoaderData()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user.name)
  const [editedEmail, setEditedEmail] = useState(user.email)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const uploadAvatarMutation = useMutation({
    mutationFn: (data: { base64: string; filename: string; userId: string }) =>
      uploadAvatar({ data }),
  })

  const updateUserMutation = useMutation({
    mutationFn: (data: {
      userId: string
      name?: string
      email?: string
      avatar?: string
    }) => updateUser({ data }),
    onSuccess: () => {
      setIsEditing(false)
      setAvatarFile(null)
      setAvatarPreview(null)
      router.invalidate()
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser({ data: { userId } }),
    onSuccess: () => {
      router.navigate({ to: '/users' })
    },
  })

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset values
      setEditedName(user.name)
      setEditedEmail(user.email)
      setAvatarFile(null)
      setAvatarPreview(null)
      updateUserMutation.reset()
    }
    setIsEditing(!isEditing)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editedName || !editedEmail) return

    let avatarPath: string | undefined = undefined

    // Upload avatar if a new one was selected
    if (avatarFile) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string
        const result = await uploadAvatarMutation.mutateAsync({
          base64,
          filename: avatarFile.name,
          userId: user.id,
        })
        avatarPath = result.path

        // Update user with avatar path
        updateUserMutation.mutate({
          userId: user.id,
          name: editedName !== user.name ? editedName : undefined,
          email: editedEmail !== user.email ? editedEmail : undefined,
          avatar: avatarPath,
        })
      }
      reader.readAsDataURL(avatarFile)
    } else {
      // No new avatar, just update name/email
      updateUserMutation.mutate({
        userId: user.id,
        name: editedName !== user.name ? editedName : undefined,
        email: editedEmail !== user.email ? editedEmail : undefined,
      })
    }
  }

  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return
    deleteUserMutation.mutate(user.id)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Button component={Link} to="/users" variant="text" sx={{ mb: 2 }}>
            ← Back to Users
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {user.name}
            </Typography>
            <Box>
              {!isEditing && (
                <Button
                  variant="outlined"
                  onClick={handleEditToggle}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {updateUserMutation.isError && (
          <MutationError
            error={updateUserMutation.error}
            action="update user"
          />
        )}
        {updateUserMutation.isSuccess && !isEditing && (
          <Alert severity="success">User updated successfully!</Alert>
        )}
        {deleteUserMutation.isError && (
          <MutationError
            error={deleteUserMutation.error}
            action="delete user"
          />
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={avatarPreview || user.avatar || undefined}
                    alt={user.name}
                    sx={{ width: 80, height: 80 }}
                  >
                    {!user.avatar &&
                      !avatarPreview &&
                      user.name[0].toUpperCase()}
                  </Avatar>
                  {isEditing && (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                      <label htmlFor="avatar-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          size="small"
                        >
                          {user.avatar || avatarFile
                            ? 'Change Avatar'
                            : 'Upload Avatar'}
                        </Button>
                      </label>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      required
                      disabled={updateUserMutation.isPending}
                    />
                  ) : (
                    <Typography variant="h6">{user.name}</Typography>
                  )}
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
                      required
                      disabled={updateUserMutation.isPending}
                    />
                  ) : (
                    <Typography variant="h6">{user.email}</Typography>
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    User ID
                  </Typography>
                  <Chip label={user.id} size="small" />
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    display="block"
                  >
                    Member Since
                  </Typography>
                  <Typography>{user.createdAt || 'N/A'}</Typography>
                </Box>

                {isEditing && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        updateUserMutation.isPending ||
                        !editedName ||
                        !editedEmail
                      }
                      fullWidth
                    >
                      {updateUserMutation.isPending
                        ? 'Saving...'
                        : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleEditToggle}
                      disabled={updateUserMutation.isPending}
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
              Deleting this user is permanent and cannot be undone.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
