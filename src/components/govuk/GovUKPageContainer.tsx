import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface GovUKPageContainerProps {
  children: ReactNode
}

/**
 * GOV.UK page container wrapper
 * Provides the standard govuk-width-container and govuk-main-wrapper structure
 */
export function GovUKPageContainer({ children }: GovUKPageContainerProps) {
  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper" role="main">
        {children}
      </main>
    </div>
  )
}
