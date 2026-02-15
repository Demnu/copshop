import type { User } from '../schema'

export type UserDto = User

export type UserListDto = {
  users: UserDto[]
  total: number
  page: number
  limit: number
}

export type DeleteUserDto = {
  success: boolean
}
