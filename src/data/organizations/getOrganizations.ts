import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'
import { db } from '../db'
import { organizations } from '../schema'
import { paginate } from '../paginate'
import { paginationInputValidator } from '../paginationHelpers'
import type { OrganizationListDto } from './organizationDtos'

export const getOrganizations = createServerFn({ method: 'GET' })
  .inputValidator(paginationInputValidator)
  .handler(async (ctx): Promise<OrganizationListDto> => {
    const result = await paginate(db, {
      table: organizations,
      pagination: ctx.data,
      orderBy: asc(organizations.name),
    })

    return {
      organizations: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    }
  })
