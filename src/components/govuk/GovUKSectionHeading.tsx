import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface GovUKSectionHeadingProps {
  children: ReactNode
  /** Heading size (s=small, m=medium, l=large, xl=extra large) */
  size?: 's' | 'm' | 'l' | 'xl'
  /** Additional spacing after the section */
  marginBottom?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

/**
 * GOV.UK section heading with consistent styling and optional bottom margin
 * Commonly used for form sections or content areas
 */
export function GovUKSectionHeading({
  children,
  size = 'm',
  marginBottom,
}: GovUKSectionHeadingProps) {
  const HeadingTag = size === 'xl' ? 'h1' : size === 'l' ? 'h1' : 'h2'
  const sizeClass =
    size === 'xl'
      ? 'govuk-heading-xl'
      : size === 'l'
        ? 'govuk-heading-l'
        : size === 'm'
          ? 'govuk-heading-m'
          : 'govuk-heading-s'

  const className = marginBottom
    ? `${sizeClass} govuk-!-margin-bottom-${marginBottom}`
    : sizeClass

  return <HeadingTag className={className}>{children}</HeadingTag>
}
