import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { organizations, type NewOrganization } from '../schema'
import { NotFoundError } from '../errors'
import type { OrganizationDto } from './organizationDtos'

export const updateOrganization = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      organizationId: z.number(),
      name: z.string().min(1, 'Organization name is required').optional(),
      address: z.string().nullable().optional(),
      email: z
        .string()
        .email()
        .optional()
        .or(z.literal(''))
        .nullable()
        .optional(),
      contactNumber: z.string().nullable().optional(),
    }),
  )
  .handler(async (ctx): Promise<OrganizationDto> => {
    const current = await db.query.organizations.findFirst({
      where: eq(organizations.id, ctx.data.organizationId),
    })

    if (!current) {
      throw new NotFoundError('Organization not found')
    }

    const updateData: Partial<NewOrganization> = {}

    if (ctx.data.name !== undefined) {
      updateData.name = ctx.data.name
    }

    if (ctx.data.address !== undefined) {
      if (ctx.data.address === null || ctx.data.address.trim() === '') {
        updateData.address = undefined
        updateData.latitude = undefined
        updateData.longitude = undefined
      } else if (ctx.data.address !== current.address) {
        updateData.address = ctx.data.address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ctx.data.address)}&format=json&limit=1`,
            { headers: { 'User-Agent': 'CopShop-App/1.0' } },
          )
          if (response.ok) {
            const data = await response.json()
            if (data.length > 0) {
              updateData.latitude = data[0].lat
              updateData.longitude = data[0].lon
            }
          }
        } catch (error) {
          console.error('Geocoding error:', error)
        }
      }
    }

    if (ctx.data.email !== undefined) {
      updateData.email = ctx.data.email || undefined
    }

    if (ctx.data.contactNumber !== undefined) {
      updateData.contactNumber = ctx.data.contactNumber || undefined
    }

    const [updated] = await db
      .update(organizations)
      .set(updateData)
      .where(eq(organizations.id, ctx.data.organizationId))
      .returning()

    if (!updated) {
      throw new NotFoundError('Organization not found after update')
    }

    return updated
  })
