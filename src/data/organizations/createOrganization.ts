import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../db'
import { organizations, type NewOrganization } from '../schema'
import type { OrganizationDto } from './organizationDtos'

export const createOrganization = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().min(1, 'Organization name is required'),
      address: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      contactNumber: z.string().optional(),
    }),
  )
  .handler(async (ctx): Promise<OrganizationDto> => {
    let latitude: string | undefined = undefined
    let longitude: string | undefined = undefined

    if (ctx.data.address && ctx.data.address.trim()) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ctx.data.address)}&format=json&limit=1`,
          { headers: { 'User-Agent': 'CopShop-App/1.0' } },
        )
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            latitude = data[0].lat
            longitude = data[0].lon
          }
        }
      } catch (error) {
        console.error('Geocoding error:', error)
      }
    }

    const newOrg: NewOrganization = {
      name: ctx.data.name,
      address: ctx.data.address || undefined,
      email: ctx.data.email || undefined,
      contactNumber: ctx.data.contactNumber || undefined,
      latitude,
      longitude,
    }

    const [organization] = await db
      .insert(organizations)
      .values(newOrg)
      .returning()
    return organization
  })
