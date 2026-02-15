import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface GovUKPageHeaderProps {
  title: string
  caption?: string
  children?: ReactNode
}

export function GovUKPageHeader({
  title,
  caption,
  children,
}: GovUKPageHeaderProps) {
  return (
    <div className="govuk-!-margin-bottom-8">
      <h1 className="govuk-heading-xl govuk-!-margin-bottom-2">{title}</h1>
      {caption && (
        <p className="govuk-body-l" style={{ color: '#505a5f' }}>
          {caption}
        </p>
      )}
      {children}
    </div>
  )
}
