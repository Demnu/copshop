import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, desc } from 'drizzle-orm'
import { db } from '../db'
import { policeOfficers } from '../schema'
import { paginate } from '../paginate'
import { paginationInputValidator } from '../paginationHelpers'
import type { PaginatedPoliceOfficerDtos } from './policeOfficerDtos'

export const getPoliceOfficers = createServerFn({ method: 'GET' })
  .inputValidator(
    paginationInputValidator.extend({ organizationId: z.number().optional() }),
  )
  .handler(async (ctx): Promise<PaginatedPoliceOfficerDtos> => {
    const whereClause = ctx.data.organizationId
      ? eq(policeOfficers.organizationId, ctx.data.organizationId)
      : undefined

    const result = await paginate(db, {
      table: policeOfficers,
      where: whereClause,
      pagination: ctx.data,
      orderBy: desc(policeOfficers.createdAt),
    })

    return {
      officers: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    }
  })
