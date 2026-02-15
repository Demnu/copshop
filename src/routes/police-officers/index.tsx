import { createFileRoute } from '@tanstack/react-router'
import { paginationSearchSchema } from '@/components/usePagination'
import { z } from 'zod'
import { PoliceOfficersListUK } from '@/pages/PoliceOfficersListUK/PoliceOfficersListUK'

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
  const { page = 1, organizationId } = Route.useSearch()

  return <PoliceOfficersListUK page={page} organizationId={organizationId} />
}
