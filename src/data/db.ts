import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import * as schema from './schema'

// Initialize SQLite database
const dbPath = join(process.cwd(), 'data.db')
const sqlite = new Database(dbPath)

// Enable foreign keys
sqlite.pragma('foreign_keys = ON')

// Create Drizzle instance
export const db = drizzle(sqlite, { schema })
