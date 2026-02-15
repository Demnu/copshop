import { count, type SQL } from 'drizzle-orm'
import type { SQLiteTable } from 'drizzle-orm/sqlite-core'
import type { db as dbType } from './db'
import { getPaginationOffset, type PaginationInput } from './paginationHelpers'

/**
 * Generic pagination helper that runs data + count queries in parallel.
 * Uses the SAME where clause for both queries to ensure consistency.
 *
 * @param db - The database instance
 * @param table - The table to query
 * @param where - The where clause to apply (shared between data and count queries)
 * @param pagination - Page and limit settings
 * @param orderBy - Optional order by clause
 * @returns Promise with items, total count, page, and limit
 */
export async function paginate<T extends SQLiteTable>(
  db: typeof dbType,
  options: {
    table: T
    where?: SQL
    pagination: PaginationInput
    orderBy?: SQL | SQL[]
  },
): Promise<{
  items: any[]
  total: number
  page: number
  limit: number
}> {
  const { table, where: whereClause, pagination, orderBy } = options
  const offset = getPaginationOffset(pagination.page, pagination.limit)

  // Build the base query
  let dataQuery = db.select().from(table).$dynamic()

  if (whereClause) {
    dataQuery = dataQuery.where(whereClause)
  }

  if (orderBy) {
    if (Array.isArray(orderBy)) {
      dataQuery = dataQuery.orderBy(...orderBy)
    } else {
      dataQuery = dataQuery.orderBy(orderBy)
    }
  }

  dataQuery = dataQuery.limit(pagination.limit).offset(offset)

  // Build the count query with the SAME where clause
  let countQuery = db.select({ value: count() }).from(table).$dynamic()

  if (whereClause) {
    countQuery = countQuery.where(whereClause)
  }

  // Execute both queries in parallel
  const [items, [{ value: total }]] = await Promise.all([dataQuery, countQuery])

  return {
    items,
    total,
    page: pagination.page,
    limit: pagination.limit,
  }
}
