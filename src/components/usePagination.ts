import { z } from 'zod'

export const paginationSearchSchema = z.object({
  page: z.number().min(1).catch(1),
})

export type PaginationResult = {
  page: number
  onPageChange: (newPage: number) => void
}
