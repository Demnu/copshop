import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface SummaryListRow {
  key: string
  value: ReactNode
}

interface GovUKSummaryListProps {
  rows: SummaryListRow[]
}

export function GovUKSummaryList({ rows }: GovUKSummaryListProps) {
  return (
    <dl className="govuk-summary-list">
      {rows.map((row, index) => (
        <div key={index} className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">{row.key}</dt>
          <dd className="govuk-summary-list__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
