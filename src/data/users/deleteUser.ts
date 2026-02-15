import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../schema'
import type { DeleteUserDto } from './userDtos'

export const deleteUser = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async (ctx): Promise<DeleteUserDto> => {
    await db.delete(users).where(eq(users.id, ctx.data.userId))
    return { success: true }
  })
