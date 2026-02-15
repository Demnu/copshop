import type { PoliceOfficer } from '../schema'

export type PoliceOfficerDto = PoliceOfficer & {
  organizationName?: string
}

export type PaginatedPoliceOfficerDtos = {
  officers: PoliceOfficerDto[]
  total: number
  page: number
  limit: number
}

export type DeletePoliceOfficerDto = {
  success: boolean
}
