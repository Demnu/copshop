import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Enums
export const UserRole = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  CONTRIBUTOR: 'contributor',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// Users table - kept as generic boilerplate for future use
export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text('username').unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['admin', 'moderator', 'contributor'] })
    .notNull()
    .default('contributor'),
  avatar: text('avatar'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// TypeScript types inferred from schema
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
