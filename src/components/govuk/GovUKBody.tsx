import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface GovUKBodyProps {
  children: ReactNode
  /** Size variant */
  size?: 's' | 'm' | 'l'
  /** Apply lead paragraph styling (larger, for introductory text) */
  lead?: boolean
  /** Bottom margin using GOV.UK spacing scale (0-9) */
  marginBottom?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  /** Additional CSS classes */
  className?: string
}

/**
 * GOV.UK body text component
 * Use for paragraphs and text content following GOV.UK typography
 *
 * @example
 * <GovUKBody>This is body text with GOV.UK styling.</GovUKBody>
 *
 * @example
 * <GovUKBody size="l">Larger body text</GovUKBody>
 *
 * @example
 * <GovUKBody lead>This is a lead paragraph for introductions.</GovUKBody>
 */
export function GovUKBody({
  children,
  size,
  lead = false,
  marginBottom,
  className,
}: GovUKBodyProps) {
  const classes = [
    'govuk-body',
    lead && 'govuk-body-l',
    size === 's' && 'govuk-body-s',
    size === 'l' && !lead && 'govuk-body-l',
    marginBottom !== undefined && `govuk-!-margin-bottom-${marginBottom}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <p className={classes}>{children}</p>
}
