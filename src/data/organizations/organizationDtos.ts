import type { Organization } from '../schema'

export type OrganizationDto = Organization

export type OrganizationListDto = {
  organizations: OrganizationDto[]
  total: number
  page: number
  limit: number
}

export type CreateOrganizationDto = {
  name: string
}

export type UpdateOrganizationDto = {
  organizationId: number
  name: string
}

export type DeleteOrganizationDto = {
  success: boolean
}
