import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { OrganizationDto } from '@/data/organizations/organizationDtos'
import { GovUKSummaryList, GovUKSectionHeading } from '@/components/govuk'

interface OrganizationViewUKProps {
  organization: OrganizationDto
}

export function OrganizationViewUK({ organization }: OrganizationViewUKProps) {
  const rows = [
    { key: 'Name', value: organization.name || '—' },
    { key: 'Address', value: organization.address || '—' },
    { key: 'Contact number', value: organization.contactNumber || '—' },
    { key: 'Email', value: organization.email || '—' },
    {
      key: 'Organization ID',
      value: (
        <code style={{ fontFamily: 'monospace', fontSize: '16px' }}>
          #{organization.id}
        </code>
      ),
    },
  ]

  return (
    <div className="govuk-!-margin-bottom-8">
      <GovUKSectionHeading>Organization Information</GovUKSectionHeading>
      <GovUKSummaryList rows={rows} />
    </div>
  )
}
