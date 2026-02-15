import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import {
  policeOfficers,
  organizations,
  type NewPoliceOfficer,
  PoliceOfficerVerificationStatus,
} from '../schema'
import { NotFoundError } from '../errors'
import type { PoliceOfficerDto } from './policeOfficerDtos'

export const updatePoliceOfficer = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      officerId: z.number(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      badgeNumber: z.string().optional(),
      rank: z.string().optional(),
      organizationId: z.number().nullable().optional(),
      verificationStatus: z
        .enum([
          PoliceOfficerVerificationStatus.CONFIRMED,
          PoliceOfficerVerificationStatus.SUSPECTED,
          PoliceOfficerVerificationStatus.UNVERIFIED,
        ])
        .optional(),
      estimatedDob: z.string().optional(),
    }),
  )
  .handler(async (ctx): Promise<PoliceOfficerDto> => {
    if (ctx.data.organizationId) {
      const org = await db.query.organizations.findFirst({
        where: eq(organizations.id, ctx.data.organizationId),
      })
      if (!org) {
        throw new NotFoundError('Organization not found')
      }
    }

    const updates: Partial<NewPoliceOfficer> = {}
    if (ctx.data.firstName !== undefined) updates.firstName = ctx.data.firstName
    if (ctx.data.lastName !== undefined) updates.lastName = ctx.data.lastName
    if (ctx.data.badgeNumber !== undefined)
      updates.badgeNumber = ctx.data.badgeNumber
    if (ctx.data.rank !== undefined) updates.rank = ctx.data.rank
    if (ctx.data.organizationId !== undefined)
      updates.organizationId = ctx.data.organizationId
    if (ctx.data.verificationStatus !== undefined)
      updates.verificationStatus = ctx.data.verificationStatus
    if (ctx.data.estimatedDob !== undefined)
      updates.estimatedDob = ctx.data.estimatedDob

    const [updated] = await db
      .update(policeOfficers)
      .set(updates)
      .where(eq(policeOfficers.id, ctx.data.officerId))
      .returning()

    if (!updated) {
      throw new NotFoundError('Police officer not found')
    }

    return updated
  })
