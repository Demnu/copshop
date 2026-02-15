import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { useState } from 'react'
import type { Organization } from '@/data/schema'
import {
  GovUKFormGroup,
  GovUKInput,
  GovUKSectionHeading,
} from '@/components/govuk'

interface OrganizationEditFormUKProps {
  formId: string
  organization: Organization
  onSubmit: (data: {
    organizationId: number
    name?: string
    address?: string | null
    contactNumber?: string | null
    email?: string | null
  }) => void
  isPending: boolean
}

export function OrganizationEditFormUK({
  formId,
  organization,
  onSubmit,
  isPending,
}: OrganizationEditFormUKProps) {
  const [name, setName] = useState(organization.name ?? '')
  const [address, setAddress] = useState(organization.address ?? '')
  const [contactNumber, setContactNumber] = useState(
    organization.contactNumber ?? '',
  )
  const [email, setEmail] = useState(organization.email ?? '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      organizationId: organization.id,
      name: name || undefined,
      address: address || null,
      contactNumber: contactNumber || null,
      email: email || null,
    })
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="govuk-!-margin-bottom-8"
    >
      <GovUKSectionHeading>Edit Organization Information</GovUKSectionHeading>

      <GovUKFormGroup label="Name" htmlFor="name">
        <GovUKInput
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          required
        />
      </GovUKFormGroup>

      <GovUKFormGroup label="Address" htmlFor="address">
        <GovUKInput
          id="address"
          name="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isPending}
        />
      </GovUKFormGroup>

      <GovUKFormGroup label="Contact number" htmlFor="contact-number">
        <GovUKInput
          id="contact-number"
          name="contactNumber"
          type="tel"
          width="20"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          disabled={isPending}
        />
      </GovUKFormGroup>

      <GovUKFormGroup label="Email" htmlFor="email">
        <GovUKInput
          id="email"
          name="email"
          type="email"
          width="20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </GovUKFormGroup>
    </form>
  )
}
