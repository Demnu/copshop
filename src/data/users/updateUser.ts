import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users, type User } from '../schema'
import { ConflictError } from '../errors'
import type { UserDto } from './userDtos'

export const updateUser = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      userId: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      avatar: z.string().optional(),
    }),
  )
  .handler(async (ctx): Promise<UserDto> => {
    const updates: Partial<User> = {}

    if (ctx.data.name) updates.name = ctx.data.name

    if (ctx.data.email) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, ctx.data.email),
      })

      if (existingUser && existingUser.id !== ctx.data.userId) {
        throw new ConflictError('Email is already in use by another user')
      }
      updates.email = ctx.data.email
    }

    if (ctx.data.avatar !== undefined) updates.avatar = ctx.data.avatar

    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, ctx.data.userId))
      .returning()

    return user
  })
