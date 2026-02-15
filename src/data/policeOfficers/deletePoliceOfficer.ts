import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { policeOfficers } from '../schema'
import type { DeletePoliceOfficerDto } from './policeOfficerDtos'

export const deletePoliceOfficer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ officerId: z.number() }))
  .handler(async (ctx): Promise<DeletePoliceOfficerDto> => {
    await db
      .delete(policeOfficers)
      .where(eq(policeOfficers.id, ctx.data.officerId))
    return { success: true }
  })
