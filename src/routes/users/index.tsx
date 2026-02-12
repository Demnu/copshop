import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button, Avatar, Chip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/data/users/userService'
import type { UserDto } from '@/data/users/userDtos'
import { PageContainer } from '@/components/PageContainer'
import { PageHeader } from '@/components/PageHeader'
import { PaginatedList } from '@/components/PaginatedList'
import { getPaginationSubtitle } from '@/components/PaginatedList'
import { paginationSearchSchema } from '@/components/usePagination'
import type { Column } from '@/components/DataTable'
import { queryKeys } from '@/lib/queryKeys'

export const Route = createFileRoute('/users/')({
  component: UsersPage,
  validateSearch: paginationSearchSchema,
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
  const navigate = useNavigate({ from: Route.fullPath })
  const { page = 1 } = Route.useSearch()

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.users.list(page),
    queryFn: () => getUsers({ data: { page, limit: 10 } }),
  })

  const users = data?.users || []
  const total = data?.total || 0
  const limit = data?.limit || 10

  const columns: Column<UserDto>[] = [
    {
      id: 'avatar',
      label: '',
      format: (user) => (
        <Avatar
          src={user.avatar || undefined}
          alt={user.name}
          sx={{ width: 40, height: 40 }}
        >
          {!user.avatar && user.name[0].toUpperCase()}
        </Avatar>
      ),
    },
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'email',
      label: 'Email',
    },
    {
      id: 'id',
      label: 'User ID',
      format: (user) => (
        <Chip label={user.id.slice(0, 8)} size="small" variant="outlined" />
      ),
    },
  ]

  return (
    <PageContainer maxWidth="lg">
      <PageHeader
        title="Users Directory"
        subtitle={getPaginationSubtitle(total, page, limit, 'user')}
        action={
          <Button component={Link} to="/users/new" variant="contained">
            Create User
          </Button>
        }
      />

      <PaginatedList
        data={users}
        columns={columns}
        pagination={{ page, limit, total }}
        onPageChange={(newPage) => navigate({ search: { page: newPage } })}
        getRowKey={(user) => user.id}
        isLoading={isLoading}
        error={error}
        emptyMessage="No users found"
        onRowClick={(user) =>
          navigate({ to: '/users/$userId', params: { userId: user.id } })
        }
      />
    </PageContainer>
  )
}
