import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { organizations } from '../schema'
import type { OrganizationDto } from './organizationDtos'

export const getOrganizationById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ organizationId: z.number() }))
  .handler(async (ctx): Promise<OrganizationDto | undefined> => {
    const organization = await db.query.organizations.findFirst({
      where: eq(organizations.id, ctx.data.organizationId),
    })
    return organization
  })
