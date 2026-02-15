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

export const createPoliceOfficer = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      firstName: z.string().min(1, 'First name is required').optional(),
      lastName: z.string().min(1, 'Last name is required').optional(),
      badgeNumber: z.string().optional(),
      rank: z.string().optional(),
      organizationId: z.number().optional(),
      verificationStatus: z
        .enum(['confirmed', 'suspected', 'unverified'])
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

    const newOfficer: NewPoliceOfficer = {
      firstName: ctx.data.firstName,
      lastName: ctx.data.lastName,
      badgeNumber: ctx.data.badgeNumber,
      rank: ctx.data.rank,
      organizationId: ctx.data.organizationId,
      verificationStatus:
        ctx.data.verificationStatus ||
        PoliceOfficerVerificationStatus.UNVERIFIED,
      estimatedDob: ctx.data.estimatedDob,
    }

    const [officer] = await db
      .insert(policeOfficers)
      .values(newOfficer)
      .returning()
    return officer
  })
