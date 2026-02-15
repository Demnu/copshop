import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getPoliceOfficers } from '@/data/policeOfficers/getPoliceOfficers'
import { getAllOrganizations } from '@/data/organizations/getAllOrganizations'
import type { PoliceOfficerDto } from '@/data/policeOfficers/policeOfficerDtos'
import { queryKeys } from '@/lib/queryKeys'
import {
  GovUKButton,
  GovUKPageHeader,
  GovUKTable,
  GovUKTag,
  GovUKPagination,
  GovUKFormGroup,
  GovUKSelect,
  GovUKPageContainer,
  GovUKBody,
} from '@/components/govuk'

interface PoliceOfficersListUKProps {
  page: number
  organizationId?: number
}

export function PoliceOfficersListUK({
  page,
  organizationId,
}: PoliceOfficersListUKProps) {
  const navigate = useNavigate({ from: '/police-officers/' })

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.policeOfficers.list({ page, organizationId }),
    queryFn: () =>
      getPoliceOfficers({ data: { page, limit: 10, organizationId } }),
  })

  const officers = data?.officers || []
  const total = data?.total || 0
  const limit = data?.limit || 10
  const totalPages = Math.ceil(total / limit)

  const { data: organizations } = useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => getAllOrganizations(),
  })

  const getOrgName = (orgId: number | null) => {
    if (!orgId || !organizations) return 'None'
    const org = organizations.find((o) => o.id === orgId)
    return org?.name || 'Unknown'
  }

  const getVerificationTag = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return { color: 'green' as const, text: 'Confirmed' }
      case 'SUSPECTED':
        return { color: 'yellow' as const, text: 'Suspected' }
      case 'UNVERIFIED':
      default:
        return { color: 'grey' as const, text: 'Unverified' }
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (officer: PoliceOfficerDto) =>
        [officer.firstName, officer.lastName].filter(Boolean).join(' ') ||
        'Unknown',
    },
    {
      key: 'badgeNumber',
      header: 'Badge number',
      render: (officer: PoliceOfficerDto) => officer.badgeNumber || '—',
    },
    {
      key: 'rank',
      header: 'Rank',
      render: (officer: PoliceOfficerDto) => officer.rank || '—',
    },
    {
      key: 'organization',
      header: 'Organization',
      render: (officer: PoliceOfficerDto) => getOrgName(officer.organizationId),
    },
    {
      key: 'status',
      header: 'Status',
      render: (officer: PoliceOfficerDto) => {
        const tag = getVerificationTag(officer.verificationStatus)
        return <GovUKTag color={tag.color}>{tag.text}</GovUKTag>
      },
    },
  ]

  const getPaginationSubtitle = () => {
    if (total === 0) return 'No officers found'
    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, total)
    return `Showing ${start} to ${end} of ${total} officer${total !== 1 ? 's' : ''}`
  }

  return (
    <GovUKPageContainer>
      <GovUKPageHeader title="Police Officers">
        <Link to="/police-officers/new">
          <GovUKButton>Add officer</GovUKButton>
        </Link>
      </GovUKPageHeader>

      {/* Filter */}
      <div className="govuk-!-margin-bottom-6">
        <GovUKFormGroup
          label="Filter by organization"
          htmlFor="organization-filter"
        >
          <GovUKSelect
            id="organization-filter"
            value={organizationId ?? ''}
            options={organizations?.map((org) => ({
              value: org.id,
              label: org.name,
            }))}
            placeholder="All organizations"
            onChange={(e) => {
              const newOrgId = e.target.value
                ? Number(e.target.value)
                : undefined
              navigate({
                to: '/police-officers',
                search: {
                  page: 1,
                  organizationId: newOrgId,
                },
              })
            }}
          />
        </GovUKFormGroup>
      </div>

      {/* Loading State */}
      {isLoading && <GovUKBody>Loading officers...</GovUKBody>}

      {/* Results count */}
      {!isLoading && (
        <GovUKBody marginBottom={4}>{getPaginationSubtitle()}</GovUKBody>
      )}

      {/* Table */}
      {!isLoading && (
        <>
          <GovUKTable
            columns={columns}
            data={officers}
            getRowKey={(officer) => officer.id}
            onRowClick={(officer) =>
              navigate({
                to: '/police-officers/$officerId',
                params: { officerId: String(officer.id) },
              })
            }
          />

          {/* Pagination */}
          <GovUKPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) =>
              navigate({
                to: '/police-officers',
                search: {
                  page: newPage,
                  organizationId,
                },
              })
            }
          />
        </>
      )}
    </GovUKPageContainer>
  )
}
