import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getOrganizations } from '@/data/organizations/getOrganizations'
import type { OrganizationDto } from '@/data/organizations/organizationDtos'
import { queryKeys } from '@/lib/queryKeys'
import {
  GovUKPageHeader,
  GovUKTable,
  GovUKPagination,
  GovUKPageContainer,
  GovUKBody,
} from '@/components/govuk'

interface OrganizationsListUKProps {
  page: number
}

export function OrganizationsListUK({ page }: OrganizationsListUKProps) {
  const navigate = useNavigate({ from: '/organizations/' })

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.organizations.list(page),
    queryFn: () => getOrganizations({ data: { page, limit: 10 } }),
  })

  const organizations = data?.organizations || []
  const total = data?.total || 0
  const limit = data?.limit || 10
  const totalPages = Math.ceil(total / limit)

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (org: OrganizationDto) => org.name || 'Unknown',
    },
    {
      key: 'address',
      header: 'Address',
      render: (org: OrganizationDto) => org.address || '—',
    },
    {
      key: 'contactNumber',
      header: 'Contact number',
      render: (org: OrganizationDto) => org.contactNumber || '—',
    },
    {
      key: 'email',
      header: 'Email',
      render: (org: OrganizationDto) => org.email || '—',
    },
  ]

  const getPaginationSubtitle = () => {
    if (total === 0) return 'No organizations found'
    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, total)
    return `Showing ${start} to ${end} of ${total} organization${total !== 1 ? 's' : ''}`
  }

  return (
    <GovUKPageContainer>
      <GovUKPageHeader title="Organizations" />

      {/* Loading State */}
      {isLoading && <GovUKBody>Loading organizations...</GovUKBody>}

      {/* Results count */}
      {!isLoading && (
        <GovUKBody marginBottom={4}>{getPaginationSubtitle()}</GovUKBody>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <GovUKTable
            columns={columns}
            data={organizations}
            getRowKey={(org) => org.id}
            onRowClick={(org) =>
              navigate({
                to: '/organizations/$organizationId',
                params: { organizationId: String(org.id) },
              })
            }
          />

          {/* Pagination */}
          <GovUKPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) =>
              navigate({
                to: '/organizations',
                search: {
                  page: newPage,
                },
              })
            }
          />
        </>
      )}
    </GovUKPageContainer>
  )
}
