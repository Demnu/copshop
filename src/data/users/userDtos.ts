import type { User } from '../schema'

// User DTOs
export type UserDto = User

export type UserListDto = {
  users: UserDto[]
  total: number
  page: number
  limit: number
}

export type CreateUserDto = {
  name: string
  email: string
  avatar?: string
}

export type UpdateUserDto = {
  userId: string
  name?: string
  email?: string
  avatar?: string
}

export type DeleteUserDto = {
  success: boolean
}
