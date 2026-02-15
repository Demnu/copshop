import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users, type NewUser } from '../schema'
import { ConflictError } from '../errors'
import type { UserDto } from './userDtos'

export const createUser = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Valid email is required'),
      avatar: z.string().optional(),
    }),
  )
  .handler(async (ctx): Promise<UserDto> => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, ctx.data.email),
    })

    if (existingUser) {
      throw new ConflictError('Email is already in use')
    }

    const newUser: NewUser = {
      name: ctx.data.name,
      email: ctx.data.email,
      avatar: ctx.data.avatar,
    }

    const [user] = await db.insert(users).values(newUser).returning()
    return user
  })
