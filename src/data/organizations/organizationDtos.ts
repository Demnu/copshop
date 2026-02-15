import type { Organization } from '../schema'

/**
 * DTOs for organization endpoints.
 * - OrganizationDto: The main organization data transfer object
 * - OrganizationListDto: Paginated list response
 * - DeleteOrganizationDto: Delete operation response
 */

export type OrganizationDto = Organization

export type OrganizationListDto = {
  organizations: OrganizationDto[]
  total: number
  page: number
  limit: number
}
