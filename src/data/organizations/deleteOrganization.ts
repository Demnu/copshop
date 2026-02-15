import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { organizations } from '../schema'
import { NotFoundError } from '../errors'

export type DeleteOrganizationDto = {
  success: boolean
}

export const deleteOrganization = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ organizationId: z.number() }))
  .handler(async (ctx): Promise<DeleteOrganizationDto> => {
    const existing = await db.query.organizations.findFirst({
      where: eq(organizations.id, ctx.data.organizationId),
    })

    if (!existing) {
      throw new NotFoundError('Organization not found')
    }

    await db
      .delete(organizations)
      .where(eq(organizations.id, ctx.data.organizationId))

    return { success: true }
  })
