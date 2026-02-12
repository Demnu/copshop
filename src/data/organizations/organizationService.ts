import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../db'
import { organizations, type NewOrganization } from '../schema'
import { eq, count } from 'drizzle-orm'
import {
  paginationInputValidator,
  getPaginationOffset,
} from '../paginationHelpers'
import type {
  OrganizationDto,
  OrganizationListDto,
  DeleteOrganizationDto,
} from './organizationDtos'

// Forward geocode address to coordinates using OpenStreetMap Nominatim
async function forwardGeocode(address: string): Promise<{
  latitude: string
  longitude: string
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'CopShop-App/1.0',
        },
      },
    )

    if (!response.ok) return null

    const data = await response.json()
    if (data.length === 0) return null

    return {
      latitude: data[0].lat,
      longitude: data[0].lon,
    }
  } catch (error) {
    console.error('Forward geocoding error:', error)
    return null
  }
}

// Get organization by ID
export const getOrganizationById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ organizationId: z.number() }))
  .handler(async (ctx): Promise<OrganizationDto | null> => {
    const [organization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, ctx.data.organizationId))
      .limit(1)

    return organization || null
  })

// Get all organizations (for dropdowns, etc.)
export const getAllOrganizations = createServerFn({ method: 'GET' }).handler(
  async (): Promise<OrganizationDto[]> => {
    const orgs = await db
      .select()
      .from(organizations)
      .orderBy(organizations.name)
    return orgs
  },
)

// Get organizations with pagination
export const getOrganizations = createServerFn({ method: 'GET' })
  .inputValidator(paginationInputValidator)
  .handler(async (ctx): Promise<OrganizationListDto> => {
    const offset = getPaginationOffset(ctx.data.page, ctx.data.limit)

    const [orgList, [{ value: totalCount }]] = await Promise.all([
      db
        .select()
        .from(organizations)
        .orderBy(organizations.name)
        .limit(ctx.data.limit)
        .offset(offset),
      db.select({ value: count() }).from(organizations),
    ])

    return {
      organizations: orgList,
      total: totalCount,
      page: ctx.data.page,
      limit: ctx.data.limit,
    }
  })

// Create organization
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
    // Forward geocode address if provided
    let latitude: string | null = null
    let longitude: string | null = null
    if (ctx.data.address && ctx.data.address.trim()) {
      const coords = await forwardGeocode(ctx.data.address)
      if (coords) {
        latitude = coords.latitude
        longitude = coords.longitude
      }
    }

    const newOrg: NewOrganization = {
      name: ctx.data.name,
      address: ctx.data.address || null,
      email: ctx.data.email || null,
      contactNumber: ctx.data.contactNumber || null,
      latitude: latitude,
      longitude: longitude,
    }

    const [organization] = await db
      .insert(organizations)
      .values(newOrg)
      .returning()

    return organization
  })

// Update organization
export const updateOrganization = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      organizationId: z.number(),
      name: z.string().min(1, 'Organization name is required'),
      address: z.string().optional(),
      email: z.string().email().optional().or(z.literal('')),
      contactNumber: z.string().optional(),
    }),
  )
  .handler(async (ctx): Promise<OrganizationDto> => {
    // Get current organization to check if address changed
    const [current] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, ctx.data.organizationId))
      .limit(1)

    // Forward geocode if address provided and changed
    let latitude: string | null | undefined = undefined
    let longitude: string | null | undefined = undefined
    if (ctx.data.address && ctx.data.address.trim()) {
      if (ctx.data.address !== current?.address) {
        const coords = await forwardGeocode(ctx.data.address)
        if (coords) {
          latitude = coords.latitude
          longitude = coords.longitude
        }
      }
    } else if (!ctx.data.address) {
      // Clear coordinates if address removed
      latitude = null
      longitude = null
    }

    const updateData: any = {
      name: ctx.data.name,
      address: ctx.data.address || null,
      email: ctx.data.email || null,
      contactNumber: ctx.data.contactNumber || null,
    }

    // Only update coordinates if they were set
    if (latitude !== undefined) {
      updateData.latitude = latitude
    }
    if (longitude !== undefined) {
      updateData.longitude = longitude
    }

    const [updated] = await db
      .update(organizations)
      .set(updateData)
      .where(eq(organizations.id, ctx.data.organizationId))
      .returning()

    if (!updated) {
      throw new Error('Organization not found')
    }

    return updated
  })

// Delete organization
export const deleteOrganization = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ organizationId: z.number() }))
  .handler(async (ctx): Promise<DeleteOrganizationDto> => {
    await db
      .delete(organizations)
      .where(eq(organizations.id, ctx.data.organizationId))

    return { success: true }
  })
