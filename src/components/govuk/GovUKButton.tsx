import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface GovUKButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warning'
  children: ReactNode
}

export function GovUKButton({
  variant = 'primary',
  className,
  children,
  ...props
}: GovUKButtonProps) {
  const variantClass =
    variant === 'secondary'
      ? 'govuk-button--secondary'
      : variant === 'warning'
        ? 'govuk-button--warning'
        : ''

  const classes = ['govuk-button', variantClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} data-module="govuk-button" {...props}>
      {children}
    </button>
  )
}
