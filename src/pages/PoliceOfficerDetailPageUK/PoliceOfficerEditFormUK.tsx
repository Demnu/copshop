import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { useState } from 'react'
import { PoliceOfficerVerificationStatus } from '@/data/schema'
import type { PoliceOfficerVerificationStatus as VerificationStatusType } from '@/data/schema'
import type { PoliceOfficer, Organization } from '@/data/schema'
import {
  GovUKFormGroup,
  GovUKInput,
  GovUKSelect,
  GovUKSectionHeading,
} from '@/components/govuk'

interface PoliceOfficerEditFormUKProps {
  formId: string
  officer: PoliceOfficer
  organizations?: Organization[]
  onSubmit: (data: {
    officerId: number
    firstName?: string
    lastName?: string
    badgeNumber?: string
    rank?: string
    organizationId?: number
    verificationStatus?: VerificationStatusType
    estimatedDob?: string
  }) => void
  isPending: boolean
}

export function PoliceOfficerEditFormUK({
  formId,
  officer,
  organizations,
  onSubmit,
  isPending,
}: PoliceOfficerEditFormUKProps) {
  const [firstName, setFirstName] = useState(officer.firstName ?? '')
  const [lastName, setLastName] = useState(officer.lastName ?? '')
  const [badgeNumber, setBadgeNumber] = useState(officer.badgeNumber ?? '')
  const [rank, setRank] = useState(officer.rank ?? '')
  const [organizationId, setOrganizationId] = useState<number | undefined>(
    officer.organizationId ?? undefined,
  )
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatusType>(officer.verificationStatus)
  const [estimatedDob, setEstimatedDob] = useState(officer.estimatedDob ?? '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      officerId: officer.id,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      badgeNumber: badgeNumber || undefined,
      rank: rank || undefined,
      organizationId,
      verificationStatus,
      estimatedDob: estimatedDob || undefined,
    })
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="govuk-!-margin-bottom-8"
    >
      <GovUKSectionHeading>Edit Officer Information</GovUKSectionHeading>

      <GovUKFormGroup label="First name" htmlFor="first-name">
        <GovUKInput
          id="first-name"
          name="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isPending}
        />
      </GovUKFormGroup>

      <GovUKFormGroup label="Last name" htmlFor="last-name">
        <GovUKInput
          id="last-name"
          name="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isPending}
        />
      </GovUKFormGroup>

      <GovUKFormGroup label="Badge number" htmlFor="badge-number">
        <GovUKInput
          id="badge-number"
          name="badgeNumber"
          type="text"
          width="10"
          value={badgeNumber}
          onChange={(e) => setBadgeNumber(e.target.value)}
          disabled={isPending}
        />
      </GovUKFormGroup>

      <GovUKFormGroup label="Rank" htmlFor="rank">
        <GovUKInput
          id="rank"
          name="rank"
          type="text"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          disabled={isPending}
        />
      </GovUKFormGroup>

      <GovUKFormGroup label="Organization" htmlFor="organization">
        <GovUKSelect
          id="organization"
          name="organization"
          value={organizationId ?? ''}
          options={organizations?.map((org) => ({
            value: org.id,
            label: org.name,
          }))}
          placeholder="None"
          onChange={(e) =>
            setOrganizationId(
              e.target.value === '' ? undefined : Number(e.target.value),
            )
          }
          disabled={isPending}
        />
      </GovUKFormGroup>

      <GovUKFormGroup label="Verification status" htmlFor="verification-status">
        <GovUKSelect
          id="verification-status"
          name="verificationStatus"
          value={verificationStatus}
          options={[
            {
              value: PoliceOfficerVerificationStatus.UNVERIFIED,
              label: 'Unverified',
            },
            {
              value: PoliceOfficerVerificationStatus.SUSPECTED,
              label: 'Suspected',
            },
            {
              value: PoliceOfficerVerificationStatus.CONFIRMED,
              label: 'Confirmed',
            },
          ]}
          onChange={(e) =>
            setVerificationStatus(e.target.value as VerificationStatusType)
          }
          disabled={isPending}
        />
      </GovUKFormGroup>

      <GovUKFormGroup
        label="Estimated date of birth"
        htmlFor="estimated-dob"
        hint="For example, 27 3 2007"
      >
        <GovUKInput
          id="estimated-dob"
          name="estimatedDob"
          type="date"
          width="10"
          value={estimatedDob}
          onChange={(e) => setEstimatedDob(e.target.value)}
          disabled={isPending}
        />
      </GovUKFormGroup>
    </form>
  )
}
