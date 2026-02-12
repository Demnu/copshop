import { z } from 'zod'

// Reusable pagination validator
export const paginationInputValidator = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export type PaginationInput = z.infer<typeof paginationInputValidator>

// Helper to calculate offset
export function getPaginationOffset(page: number, limit: number): number {
  return (page - 1) * limit
}

// Generic paginated result type
export type PaginatedResult<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}
