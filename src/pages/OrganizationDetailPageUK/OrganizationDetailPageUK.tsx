import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteOrganization } from '@/data/organizations/deleteOrganization'
import { updateOrganization } from '@/data/organizations/updateOrganization'
import { queryKeys } from '@/lib/queryKeys'
import { OrganizationDto } from '@/data/organizations/organizationDtos'
import { OrganizationViewUK } from './OrganizationViewUK'
import { OrganizationEditFormUK } from './OrganizationEditFormUK'
import {
  GovUKButton,
  GovUKPageHeader,
  GovUKButtonGroup,
  GovUKPageContainer,
  GovUKBackLink,
} from '@/components/govuk'

const EDIT_ORGANIZATION_FORM_ID = 'edit_organization_form_uk'

interface OrganizationDetailPageUKProps {
  organization: OrganizationDto
}

export function OrganizationDetailPageUK({
  organization,
}: OrganizationDetailPageUKProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  const updateOrganizationMutation = useMutation({
    mutationFn: (data: {
      organizationId: number
      name?: string
      address?: string | null
      contactNumber?: string | null
      email?: string | null
    }) => updateOrganization({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all })
      setIsEditing(false)
      router.invalidate()
    },
  })

  const deleteOrganizationMutation = useMutation({
    mutationFn: (organizationId: number) =>
      deleteOrganization({ data: { organizationId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all })
      router.navigate({ to: '/organizations' })
    },
  })

  const handleDelete = () => {
    const orgName = organization.name || 'this organization'
    if (
      !confirm(
        `Are you sure you want to delete ${orgName}? This action cannot be undone.`,
      )
    )
      return
    deleteOrganizationMutation.mutate(organization.id)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      updateOrganizationMutation.reset()
    }
    setIsEditing(!isEditing)
  }

  const handleEditSubmit = (data: {
    organizationId: number
    name?: string
    address?: string | null
    contactNumber?: string | null
    email?: string | null
  }) => {
    updateOrganizationMutation.mutate(data)
  }

  return (
    <GovUKPageContainer>
      <GovUKBackLink to="/organizations">Back to Organizations</GovUKBackLink>

      <GovUKPageHeader title={organization.name || 'Unknown Organization'}>
        {!isEditing && (
          <GovUKButtonGroup>
            <GovUKButton onClick={handleEditToggle}>
              Edit organization
            </GovUKButton>
            <GovUKButton
              variant="warning"
              onClick={handleDelete}
              disabled={deleteOrganizationMutation.isPending}
            >
              {deleteOrganizationMutation.isPending
                ? 'Deleting...'
                : 'Delete organization'}
            </GovUKButton>
          </GovUKButtonGroup>
        )}

        {isEditing && (
          <GovUKButtonGroup>
            <GovUKButton
              type="submit"
              form={EDIT_ORGANIZATION_FORM_ID}
              disabled={updateOrganizationMutation.isPending}
            >
              {updateOrganizationMutation.isPending
                ? 'Saving...'
                : 'Save changes'}
            </GovUKButton>
            <GovUKButton
              variant="secondary"
              onClick={handleEditToggle}
              disabled={updateOrganizationMutation.isPending}
            >
              Cancel
            </GovUKButton>
          </GovUKButtonGroup>
        )}
      </GovUKPageHeader>

      {/* Organization View or Edit Form */}
      {isEditing ? (
        <OrganizationEditFormUK
          formId={EDIT_ORGANIZATION_FORM_ID}
          organization={organization}
          onSubmit={handleEditSubmit}
          isPending={updateOrganizationMutation.isPending}
        />
      ) : (
        <OrganizationViewUK organization={organization} />
      )}

      {/* Danger Zone */}
      <hr className="govuk-section-break govuk-section-break--xl govuk-section-break--visible" />

      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">
          !
        </span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-warning-text__assistive">Warning</span>
          Deleting this organization is permanent and cannot be undone.
        </strong>
      </div>
    </GovUKPageContainer>
  )
}
