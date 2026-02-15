import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../schema'
import type { UserDto } from './userDtos'

export const getUserById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async (ctx): Promise<UserDto | undefined> => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, ctx.data.userId),
    })
    return user
  })
