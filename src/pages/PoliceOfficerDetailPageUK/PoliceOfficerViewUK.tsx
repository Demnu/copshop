import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { PoliceOfficerDto } from '@/data/policeOfficers/policeOfficerDtos'
import {
  GovUKSummaryList,
  GovUKTag,
  GovUKSectionHeading,
} from '@/components/govuk'

interface PoliceOfficerViewUKProps {
  officer: PoliceOfficerDto
}

const getVerificationStatusTag = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return { color: 'green' as const, text: 'Confirmed' }
    case 'SUSPECTED':
      return { color: 'yellow' as const, text: 'Suspected' }
    case 'UNVERIFIED':
    default:
      return { color: 'grey' as const, text: 'Unverified' }
  }
}

export function PoliceOfficerViewUK({ officer }: PoliceOfficerViewUKProps) {
  const verificationTag = getVerificationStatusTag(officer.verificationStatus)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const rows = [
    { key: 'First name', value: officer.firstName || '—' },
    { key: 'Last name', value: officer.lastName || '—' },
    { key: 'Badge number', value: officer.badgeNumber || '—' },
    { key: 'Rank', value: officer.rank || '—' },
    {
      key: 'Organization',
      value: officer.organizationName || 'None assigned',
    },
    {
      key: 'Estimated date of birth',
      value: formatDate(officer.estimatedDob),
    },
    {
      key: 'Verification status',
      value: (
        <GovUKTag color={verificationTag.color}>
          {verificationTag.text}
        </GovUKTag>
      ),
    },
    {
      key: 'Officer ID',
      value: (
        <code style={{ fontFamily: 'monospace', fontSize: '16px' }}>
          #{officer.id}
        </code>
      ),
    },
  ]

  return (
    <div className="govuk-!-margin-bottom-8">
      <GovUKSectionHeading>Officer Information</GovUKSectionHeading>
      <GovUKSummaryList rows={rows} />
    </div>
  )
}
