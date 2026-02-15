import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePoliceOfficer } from '@/data/policeOfficers/deletePoliceOfficer'
import { updatePoliceOfficer } from '@/data/policeOfficers/updatePoliceOfficer'
import { getAllOrganizations } from '@/data/organizations/getAllOrganizations'
import { queryKeys } from '@/lib/queryKeys'
import { PoliceOfficerDto } from '@/data/policeOfficers/policeOfficerDtos'
import type { PoliceOfficerVerificationStatus as VerificationStatusType } from '@/data/schema'
import { PoliceOfficerViewUK } from './PoliceOfficerViewUK'
import { PoliceOfficerEditFormUK } from './PoliceOfficerEditFormUK'
import {
  GovUKButton,
  GovUKPageHeader,
  GovUKButtonGroup,
  GovUKPageContainer,
  GovUKBackLink,
} from '@/components/govuk'

const EDIT_POLICE_OFFICER_FORM_ID = 'edit_police_officer_form_uk'

interface PoliceOfficerDetailPageUKProps {
  officer: PoliceOfficerDto
}

export function PoliceOfficerDetailPageUK({
  officer,
}: PoliceOfficerDetailPageUKProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  const { data: organizations } = useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: () => getAllOrganizations(),
  })

  const updateOfficerMutation = useMutation({
    mutationFn: (data: {
      officerId: number
      firstName?: string
      lastName?: string
      badgeNumber?: string
      rank?: string
      organizationId?: number
      verificationStatus?: VerificationStatusType
      estimatedDob?: string
    }) => updatePoliceOfficer({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policeOfficers.all })
      setIsEditing(false)
      router.invalidate()
    },
  })

  const deleteOfficerMutation = useMutation({
    mutationFn: (officerId: number) =>
      deletePoliceOfficer({ data: { officerId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policeOfficers.all })
      router.navigate({ to: '/police-officers' })
    },
  })

  const handleDelete = () => {
    const officerName =
      [officer.firstName, officer.lastName].filter(Boolean).join(' ') ||
      'this officer'
    if (
      !confirm(
        `Are you sure you want to delete ${officerName}? This action cannot be undone.`,
      )
    )
      return
    deleteOfficerMutation.mutate(officer.id)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      updateOfficerMutation.reset()
    }
    setIsEditing(!isEditing)
  }

  const handleEditSubmit = (data: {
    officerId: number
    firstName?: string
    lastName?: string
    badgeNumber?: string
    rank?: string
    organizationId?: number
    verificationStatus?: VerificationStatusType
    estimatedDob?: string
  }) => {
    updateOfficerMutation.mutate(data)
  }

  const officerName =
    [officer.firstName, officer.lastName].filter(Boolean).join(' ') ||
    'Unknown Officer'

  return (
    <GovUKPageContainer>
      <GovUKBackLink to="/police-officers">Back to Officers</GovUKBackLink>

      <GovUKPageHeader
        title={officerName}
        caption={
          officer.badgeNumber ? `Badge #${officer.badgeNumber}` : undefined
        }
      >
        {!isEditing && (
          <GovUKButtonGroup>
            <GovUKButton onClick={handleEditToggle}>Edit officer</GovUKButton>
            <GovUKButton
              variant="warning"
              onClick={handleDelete}
              disabled={deleteOfficerMutation.isPending}
            >
              {deleteOfficerMutation.isPending
                ? 'Deleting...'
                : 'Delete officer'}
            </GovUKButton>
          </GovUKButtonGroup>
        )}

        {isEditing && (
          <GovUKButtonGroup>
            <GovUKButton
              type="submit"
              form={EDIT_POLICE_OFFICER_FORM_ID}
              disabled={updateOfficerMutation.isPending}
            >
              {updateOfficerMutation.isPending ? 'Saving...' : 'Save changes'}
            </GovUKButton>
            <GovUKButton
              variant="secondary"
              onClick={handleEditToggle}
              disabled={updateOfficerMutation.isPending}
            >
              Cancel
            </GovUKButton>
          </GovUKButtonGroup>
        )}
      </GovUKPageHeader>

      {/* Officer View or Edit Form */}
      {isEditing ? (
        <PoliceOfficerEditFormUK
          formId={EDIT_POLICE_OFFICER_FORM_ID}
          officer={officer}
          organizations={organizations}
          onSubmit={handleEditSubmit}
          isPending={updateOfficerMutation.isPending}
        />
      ) : (
        <PoliceOfficerViewUK officer={officer} />
      )}

      {/* Danger Zone */}
      <hr className="govuk-section-break govuk-section-break--xl govuk-section-break--visible" />

      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">
          !
        </span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          Deleting this officer is permanent and cannot be undone.
        </strong>
      </div>
    </GovUKPageContainer>
  )
}
