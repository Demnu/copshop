import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from './db'
import { NewUser, users, type User } from './schema'
import { eq, desc, count } from 'drizzle-orm'

// Get single user by ID
export const getUserById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async (ctx): Promise<User | null> => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.data.userId))
      .limit(1)

    return user || null
  })

// Delete user by ID
export const deleteUser = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async (ctx): Promise<{ success: boolean }> => {
    await db.delete(users).where(eq(users.id, ctx.data.userId))
    return { success: true }
  })

// Update user
export const updateUser = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      userId: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      avatar: z.string().optional(),
    }),
  )
  .handler(async (ctx): Promise<User> => {
    const updates: Partial<User> = {}
    if (ctx.data.name) updates.name = ctx.data.name
    if (ctx.data.email) {
      // Check if email is already taken by another user
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, ctx.data.email))
        .limit(1)

      if (existingUser && existingUser.id !== ctx.data.userId) {
        throw new Error('Email is already in use by another user')
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
// Server function to get users with pagination
export const getUsers = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
    }),
  )
  .handler(
    async (
      ctx,
    ): Promise<{
      users: User[]
      total: number
      page: number
      limit: number
    }> => {
      const { page, limit } = ctx.data
      const offset = (page - 1) * limit

      // Get total count
      const [{ value: total }] = await db.select({ value: count() }).from(users)

      // Get paginated users
      const usersList = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset)

      return {
        users: usersList,
        total,
        page,
        limit,
      }
    },
  )

export const createUser = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      name: z.string(),
      email: z.string(),
    }),
  )
  .handler(async (ctx) => {
    // Check if email is already taken
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, ctx.data.email))
      .limit(1)

    if (existingUser) {
      throw new Error('Email is already in use')
    }

    const newUser: NewUser = {
      name: ctx.data.name,
      email: ctx.data.email,
    }
    const [user] = await db.insert(users).values(newUser).returning()
    return user
  })
