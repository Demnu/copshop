import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../db'
import type { PoliceOfficerDto } from './policeOfficerDtos'

export const getAllPoliceOfficers = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ organizationId: z.number().optional() }))
  .handler(async (ctx): Promise<PoliceOfficerDto[]> => {
    const officers = await db.query.policeOfficers.findMany({
      where: (fields, { eq, and }) =>
        and(
          ctx.data.organizationId
            ? eq(fields.organizationId, ctx.data.organizationId)
            : undefined,
        ),
      orderBy: (fields, { asc }) => [asc(fields.firstName)],
    })
    return officers
  })
