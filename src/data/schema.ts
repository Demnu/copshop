import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'), // File path to avatar image
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

// TypeScript types inferred from schema
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
