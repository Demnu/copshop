import { createFileRoute } from '@tanstack/react-router'
import { paginationSearchSchema } from '@/components/usePagination'
import { OrganizationsListUK } from '@/pages/OrganizationsListUK/OrganizationsListUK'

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
        content: 'View and manage organizations.',
      },
    ],
  }),
})

function OrganizationsPage() {
  const { page = 1 } = Route.useSearch()

  return <OrganizationsListUK page={page} />
}
