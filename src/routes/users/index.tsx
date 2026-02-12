import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  Chip,
  Pagination,
  Button,
  Avatar,
} from '@mui/material'
import { getUsers } from '@/data/userService'
import { z } from 'zod'

const usersSearchSchema = z.object({
  page: z.number().min(1).catch(1),
})

export const Route = createFileRoute('/users/')({
  component: UsersPage,
  validateSearch: usersSearchSchema,
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ deps: { page } }) => {
    const result = await getUsers({ data: { page, limit: 10 } })
    return result
  },
  head: () => ({
    meta: [
      {
        title: 'Users Directory - CopShop',
      },
      {
        name: 'description',
        content: 'Browse our directory of registered users.',
      },
      {
        property: 'og:title',
        content: 'Users Directory - CopShop',
      },
      {
        property: 'og:description',
        content: 'Browse our directory of registered users.',
      },
    ],
  }),
})

function UsersPage() {
  const { users, total, page, limit } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const totalPages = Math.ceil(total / limit)

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    navigate({ search: { page: value } })
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Users Directory
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {total} {total === 1 ? 'user' : 'users'} registered • Page{' '}
                {page} of {totalPages}
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/users/new"
              variant="contained"
              color="primary"
            >
              Create User
            </Button>
          </Box>
        </Box>

        {users.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary">No users found.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {users.map((user) => (
              <Link
                key={user.id}
                to="/users/$userId"
                params={{ userId: user.id }}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={user.avatar || undefined}
                        alt={user.name}
                        sx={{ width: 56, height: 56 }}
                      >
                        {!user.avatar && user.name[0].toUpperCase()}
                      </Avatar>
                      <Stack spacing={1} flex={1}>
                        <Typography variant="h6" component="h2">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Box>
                          <Chip
                            label={`ID: ${user.id.slice(0, 8)}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Stack>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Stack>
    </Container>
  )
}
