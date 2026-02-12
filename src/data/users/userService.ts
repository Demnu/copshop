import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../db'
import { NewUser, users } from '../schema'
import { eq, desc, count } from 'drizzle-orm'
import {
  paginationInputValidator,
  getPaginationOffset,
} from '../paginationHelpers'
import type { UserDto, UserListDto, DeleteUserDto } from './userDtos'

// Get single user by ID
export const getUserById = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async (ctx): Promise<UserDto | null> => {
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
  .handler(async (ctx): Promise<DeleteUserDto> => {
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
  .handler(async (ctx): Promise<UserDto> => {
    const updates: Partial<UserDto> = {}
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

// Get users with pagination
export const getUsers = createServerFn({ method: 'GET' })
  .inputValidator(paginationInputValidator)
  .handler(async (ctx): Promise<UserListDto> => {
    const offset = getPaginationOffset(ctx.data.page, ctx.data.limit)

    const [usersList, [{ value: totalCount }]] = await Promise.all([
      db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(ctx.data.limit)
        .offset(offset),
      db.select({ value: count() }).from(users),
    ])

    return {
      users: usersList,
      total: totalCount,
      page: ctx.data.page,
      limit: ctx.data.limit,
    }
  })

// Create user
export const createUser = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Valid email is required'),
      avatar: z.string().optional(),
    }),
  )
  .handler(async (ctx): Promise<UserDto> => {
    // Check if email already exists
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
      avatar: ctx.data.avatar,
    }

    const [user] = await db.insert(users).values(newUser).returning()

    return user
  })
