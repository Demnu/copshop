import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useQuery } from '@tanstack/react-query'
import { getOrganizations } from '@/data/organizations/organizationService'
import type { OrganizationDto } from '@/data/organizations/organizationDtos'
import { PageContainer } from '@/components/PageContainer'
import { PageHeader } from '@/components/PageHeader'
import { PaginatedList } from '@/components/PaginatedList'
import { getPaginationSubtitle } from '@/components/PaginatedList'
import { paginationSearchSchema } from '@/components/usePagination'
import type { Column } from '@/components/DataTable'
import { queryKeys } from '@/lib/queryKeys'

export const Route = createFileRoute('/organizations/')({
  component: OrganizationsPage,
  validateSearch: paginationSearchSchema,
  head: () => ({
    meta: [
      {
        title: 'Organizations - CopShop',
      },
      {
        name: 'description',
        content: 'View and manage police organizations.',
      },
    ],
  }),
})

function OrganizationsPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page = 1 } = Route.useSearch()

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.organizations.list(page),
    queryFn: () => getOrganizations({ data: { page, limit: 10 } }),
  })

  const organizations = data?.organizations || []
  const total = data?.total || 0
  const limit = data?.limit || 10

  const columns: Column<OrganizationDto>[] = [
    {
      id: 'name',
      label: 'Organization Name',
    },
    {
      id: 'address',
      label: 'Location',
      format: (org) => org.address || '—',
    },
    {
      id: 'id',
      label: 'ID',
    },
  ]

  return (
    <PageContainer maxWidth="lg">
      <PageHeader
        title="Organizations"
        subtitle={getPaginationSubtitle(total, page, limit, 'organization')}
        action={
          <Button
            component={Link}
            to="/organizations/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Organization
          </Button>
        }
      />

      <PaginatedList
        data={organizations}
        columns={columns}
        pagination={{ page, limit, total }}
        onPageChange={(newPage) => navigate({ search: { page: newPage } })}
        getRowKey={(org) => org.id}
        isLoading={isLoading}
        error={error}
        emptyMessage="No organizations found. Create one to get started!"
        onRowClick={(org) =>
          navigate({
            to: '/organizations/$organizationId',
            params: { organizationId: String(org.id) },
          })
        }
      />
    </PageContainer>
  )
}
