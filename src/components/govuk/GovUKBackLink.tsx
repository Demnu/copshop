import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { Link } from '@tanstack/react-router'
import { ReactNode } from 'react'

interface GovUKBackLinkProps {
  /** Internal route path (uses React Router) */
  to?: string
  /** External URL (uses regular anchor tag) */
  href?: string
  children: ReactNode
  /** Optional onClick handler */
  onClick?: () => void
}

/**
 * GOV.UK back link component
 * Use `to` for internal navigation (React Router) or `href` for external links
 *
 * @example
 * // Internal navigation
 * <GovUKBackLink to="/police-officers">Back to Officers</GovUKBackLink>
 *
 * @example
 * // External link
 * <GovUKBackLink href="https://example.com">Back to previous site</GovUKBackLink>
 */
export function GovUKBackLink({
  to,
  href,
  children,
  onClick,
}: GovUKBackLinkProps) {
  const className = 'govuk-back-link'

  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  )
}
