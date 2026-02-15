import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { policeOfficers } from '../schema'
import { NotFoundError } from '../errors'
import type { PoliceOfficerDto } from './policeOfficerDtos'

export const getPoliceOfficerById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ officerId: z.number() }))
  .handler(async (ctx): Promise<PoliceOfficerDto> => {
    const officer = await db.query.policeOfficers.findFirst({
      where: eq(policeOfficers.id, ctx.data.officerId),
      with: { organization: true },
    })

    if (!officer) throw new NotFoundError('Police Officer could not be found')

    return {
      ...officer,
      organizationName: officer.organization?.name,
    }
  })
