import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../db'
import {
  policeOfficers,
  organizations,
  type NewPoliceOfficer,
  VerificationStatus,
} from '../schema'
import { eq, desc, count } from 'drizzle-orm'
import {
  paginationInputValidator,
  getPaginationOffset,
} from '../paginationHelpers'
import type {
  PoliceOfficerDto,
  PoliceOfficerListDto,
  DeletePoliceOfficerDto,
} from './policeOfficerDtos'

// Get police officer by ID with organization details
export const getPoliceOfficerById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ officerId: z.number() }))
  .handler(
    async (
      ctx,
    ): Promise<
      | (PoliceOfficerDto & { organization?: { id: number; name: string } })
      | null
    > => {
      const [result] = await db
        .select({
          officer: policeOfficers,
          organization: {
            id: organizations.id,
            name: organizations.name,
          },
        })
        .from(policeOfficers)
        .leftJoin(
          organizations,
          eq(policeOfficers.organizationId, organizations.id),
        )
        .where(eq(policeOfficers.id, ctx.data.officerId))
        .limit(1)

      if (!result) return null

      return {
        ...result.officer,
        organization:
          result.organization && result.organization.id
            ? result.organization
            : undefined,
      }
    },
  )

// Get all police officers with optional organization filter (for dropdowns, etc.)
export const getAllPoliceOfficers = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      organizationId: z.number().optional(),
    }),
  )
  .handler(async (ctx): Promise<PoliceOfficerDto[]> => {
    let query = db.select().from(policeOfficers).$dynamic()

    if (ctx.data.organizationId) {
      query = query.where(
        eq(policeOfficers.organizationId, ctx.data.organizationId),
      )
    }

    const officers = await query.orderBy(desc(policeOfficers.createdAt))

    return officers
  })

// Get police officers with pagination
export const getPoliceOfficers = createServerFn({ method: 'GET' })
  .inputValidator(
    paginationInputValidator.extend({
      organizationId: z.number().optional(),
    }),
  )
  .handler(async (ctx): Promise<PoliceOfficerListDto> => {
    const offset = getPaginationOffset(ctx.data.page, ctx.data.limit)

    let dataQuery = db
      .select()
      .from(policeOfficers)
      .orderBy(desc(policeOfficers.createdAt))
      .limit(ctx.data.limit)
      .offset(offset)
      .$dynamic()

    let countQuery = db
      .select({ value: count() })
      .from(policeOfficers)
      .$dynamic()

    if (ctx.data.organizationId) {
      dataQuery = dataQuery.where(
        eq(policeOfficers.organizationId, ctx.data.organizationId),
      )
      countQuery = countQuery.where(
        eq(policeOfficers.organizationId, ctx.data.organizationId),
      )
    }

    const [officersList, [{ value: totalCount }]] = await Promise.all([
      dataQuery,
      countQuery,
    ])

    return {
      officers: officersList,
      total: totalCount,
      page: ctx.data.page,
      limit: ctx.data.limit,
    }
  })

// Create police officer
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
    // Verify organization exists if provided
    if (ctx.data.organizationId) {
      const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, ctx.data.organizationId))
        .limit(1)

      if (!org) {
        throw new Error('Organization not found')
      }
    }

    const newOfficer: NewPoliceOfficer = {
      firstName: ctx.data.firstName,
      lastName: ctx.data.lastName,
      badgeNumber: ctx.data.badgeNumber,
      rank: ctx.data.rank,
      organizationId: ctx.data.organizationId,
      verificationStatus:
        ctx.data.verificationStatus || VerificationStatus.UNVERIFIED,
      estimatedDob: ctx.data.estimatedDob,
    }

    const [officer] = await db
      .insert(policeOfficers)
      .values(newOfficer)
      .returning()

    return officer
  })

// Update police officer
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
          VerificationStatus.CONFIRMED,
          VerificationStatus.SUSPECTED,
          VerificationStatus.UNVERIFIED,
        ])
        .optional(),
      estimatedDob: z.string().optional(),
    }),
  )
  .handler(async (ctx): Promise<PoliceOfficerDto> => {
    // Verify organization exists if provided
    if (ctx.data.organizationId) {
      const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, ctx.data.organizationId))
        .limit(1)

      if (!org) {
        throw new Error('Organization not found')
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
      throw new Error('Police officer not found')
    }

    return updated
  })

// Delete police officer
export const deletePoliceOfficer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ officerId: z.number() }))
  .handler(async (ctx): Promise<DeletePoliceOfficerDto> => {
    await db
      .delete(policeOfficers)
      .where(eq(policeOfficers.id, ctx.data.officerId))

    return { success: true }
  })
