import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Box,
  Grid,
} from '@mui/material'
import { getGreeting } from '@/data/serverFunctions'
import { getUsers, createUser } from '@/data/users/userService'
import { queryKeys } from '@/lib/queryKeys'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('World')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  // Query for greeting
  const { data: greetingData, isLoading: greetingLoading } = useQuery({
    queryKey: ['greeting', name],
    queryFn: () => getGreeting({ data: { name } }),
  })

  // Query for users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: queryKeys.users.list(1),
    queryFn: () => getUsers({ data: { page: 1, limit: 10 } }),
  })

  // Mutation for creating user
  const createUserMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => createUser({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      setUserName('')
      setUserEmail('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userName && userEmail) {
      createUserMutation.mutate({ name: userName, email: userEmail })
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        CopShop Demo - SSR Edition
      </Typography>

      <Stack spacing={3}>
        <Card sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Quick Navigation
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  component={Link}
                  to="/users"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
                >
                  View All Users
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  component={Link}
                  to="/demo/start/ssr"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
                >
                  View Demos
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Greeting Query
            </Typography>
            <TextField
              fullWidth
              label="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            {greetingLoading && <CircularProgress size={24} />}
            {greetingData && (
              <Alert severity="info">{greetingData.message}</Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Create User
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createUserMutation.isPending}
                  fullWidth
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </Button>
              </Stack>
            </form>
            {createUserMutation.isSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                User created successfully!
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Users List
            </Typography>
            {usersLoading && <CircularProgress />}
            {usersData && usersData.users.length > 0 && (
              <>
                <List>
                  {usersData.users.slice(0, 5).map((user) => (
                    <Link
                      key={user.id}
                      to="/users/$userId"
                      params={{ userId: user.id }}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ListItem
                        divider
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <ListItemText
                          primary={user.name}
                          secondary={user.email}
                        />
                      </ListItem>
                    </Link>
                  ))}
                </List>
                {usersData.users.length > 5 && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      component={Link}
                      to="/users"
                      variant="outlined"
                      fullWidth
                    >
                      View All {usersData.total} Users
                    </Button>
                  </Box>
                )}
              </>
            )}
            {usersData && usersData.users.length === 0 && (
              <Typography color="text.secondary">No users yet</Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
