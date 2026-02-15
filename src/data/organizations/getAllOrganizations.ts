import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import type { OrganizationDto } from './organizationDtos'

export const getAllOrganizations = createServerFn({ method: 'GET' }).handler(
  async (): Promise<OrganizationDto[]> => {
    const organizations = await db.query.organizations.findMany({
      orderBy: (orgs, { asc }) => [asc(orgs.name)],
    })
    return organizations
  },
)
