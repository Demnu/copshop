import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../schema'
import { paginate } from '../paginate'
import { paginationInputValidator } from '../paginationHelpers'
import type { UserListDto } from './userDtos'

export const getUsers = createServerFn({ method: 'GET' })
  .inputValidator(paginationInputValidator)
  .handler(async (ctx): Promise<UserListDto> => {
    const result = await paginate(db, {
      table: users,
      pagination: ctx.data,
      orderBy: desc(users.createdAt),
    })

    return {
      users: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    }
  })
