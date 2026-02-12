import type { PoliceOfficer, VerificationStatus } from '../schema'

export type PoliceOfficerDto = PoliceOfficer

export type PoliceOfficerListDto = {
  officers: PoliceOfficerDto[]
  total: number
  page: number
  limit: number
}

export type CreatePoliceOfficerDto = {
  firstName?: string
  lastName?: string
  badgeNumber?: string
  rank?: string
  organizationId?: number
  verificationStatus?: VerificationStatus
  estimatedDob?: string
}

export type UpdatePoliceOfficerDto = {
  officerId: number
  firstName?: string
  lastName?: string
  badgeNumber?: string
  rank?: string
  organizationId?: number
  verificationStatus?: VerificationStatus
  estimatedDob?: string
}

export type DeletePoliceOfficerDto = {
  success: boolean
}
