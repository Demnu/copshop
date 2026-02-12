import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Button,
  Chip,
  MenuItem,
  TextField,
  Card,
  CardContent,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { getPoliceOfficers } from '@/data/policeOfficers/policeOfficerService'
import { getAllOrganizations } from '@/data/organizations/organizationService'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '@/components/PageContainer'
import { PageHeader } from '@/components/PageHeader'
import { PaginatedList } from '@/components/PaginatedList'
import { getPaginationSubtitle } from '@/components/PaginatedList'
import { paginationSearchSchema } from '@/components/usePagination'
import type { Column } from '@/components/DataTable'
import type { PoliceOfficerDto } from '@/data/policeOfficers/policeOfficerDtos'
import { VerificationStatus } from '@/data/schema'
import { z } from 'zod'
import { queryKeys } from '@/lib/queryKeys'

const policeOfficersSearchSchema = paginationSearchSchema.extend({
  organizationId: z.number().optional(),
})

export const Route = createFileRoute('/police-officers/')({
  component: PoliceOfficersPage,
  validateSearch: policeOfficersSearchSchema,
  head: () => ({
    meta: [
      {
        title: 'Police Officers - CopShop',
      },
      {
        name: 'description',
        content: 'View and manage police officers.',
      },
    ],
  }),
})

function PoliceOfficersPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page = 1, organizationId } = Route.useSearch()

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.policeOfficers.list({ page, organizationId }),
    queryFn: () =>
      getPoliceOfficers({ data: { page, limit: 10, organizationId } }),
  })

  const officers = data?.officers || []
  const total = data?.total || 0
  const limit = data?.limit || 10

  const { data: organizations } = useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => getAllOrganizations(),
  })

  const getOrgName = (orgId: number | null) => {
    if (!orgId || !organizations) return 'None'
    const org = organizations.find((o) => o.id === orgId)
    return org?.name || 'Unknown'
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

  const columns: Column<PoliceOfficerDto>[] = [
    {
      id: 'name',
      label: 'Name',
      format: (officer) =>
        [officer.firstName, officer.lastName].filter(Boolean).join(' ') ||
        'Unknown',
    },
    {
      id: 'badgeNumber',
      label: 'Badge Number',
      format: (officer) => officer.badgeNumber || '-',
    },
    {
      id: 'rank',
      label: 'Rank',
      format: (officer) => officer.rank || '-',
    },
    {
      id: 'organizationId',
      label: 'Organization',
      format: (officer) => getOrgName(officer.organizationId),
    },
    {
      id: 'verificationStatus',
      label: 'Status',
      format: (officer) => (
        <Chip
          label={officer.verificationStatus}
          color={getVerificationColor(officer.verificationStatus)}
          size="small"
        />
      ),
    },
  ]

  return (
    <PageContainer maxWidth="lg">
      <PageHeader
        title="Police Officers"
        subtitle={getPaginationSubtitle(total, page, limit, 'officer')}
        action={
          <Button
            component={Link}
            to="/police-officers/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Officer
          </Button>
        }
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            select
            label="Filter by Organization"
            value={organizationId || ''}
            onChange={(e) =>
              navigate({
                search: {
                  page: 1,
                  organizationId: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                },
              })
            }
            sx={{ minWidth: 300 }}
          >
            <MenuItem value="">All Organizations</MenuItem>
            {organizations?.map((org) => (
              <MenuItem key={org.id} value={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      <PaginatedList
        data={officers}
        columns={columns}
        pagination={{ page, limit, total }}
        onPageChange={(newPage) =>
          navigate({ search: (prev) => ({ ...prev, page: newPage }) })
        }
        getRowKey={(officer) => officer.id}
        isLoading={isLoading}
        error={error}
        emptyMessage="No police officers found"
        onRowClick={(officer) =>
          navigate({
            to: '/police-officers/$officerId',
            params: { officerId: String(officer.id) },
          })
        }
      />
    </PageContainer>
  )
}
