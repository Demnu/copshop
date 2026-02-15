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
import { createUser } from '@/data/users/createUser'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { MutationError } from '@/components/MutationError'

export const Route = createFileRoute('/users/new')({
  component: CreateUserPage,
  head: () => ({
    meta: [
      {
        title: 'Create User - CopShop',
      },
      {
        name: 'description',
        content: 'Create a new user account.',
      },
    ],
  }),
})

function CreateUserPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const createUserMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => createUser({ data }),
    onSuccess: (user) => {
      router.navigate({ to: '/users/$userId', params: { userId: user.id } })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email) return

    createUserMutation.mutate({ name, email })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Button component={Link} to="/users" variant="text" sx={{ mb: 2 }}>
            ← Back to Users
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New User
          </Typography>
        </Box>

        {createUserMutation.isError && (
          <MutationError
            error={createUserMutation.error}
            errorMessage="create user"
          />
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  disabled={createUserMutation.isPending}
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={createUserMutation.isPending}
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={createUserMutation.isPending || !name || !email}
                    fullWidth
                  >
                    {createUserMutation.isPending
                      ? 'Creating...'
                      : 'Create User'}
                  </Button>
                  <Button
                    component={Link}
                    to="/users"
                    variant="outlined"
                    disabled={createUserMutation.isPending}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
