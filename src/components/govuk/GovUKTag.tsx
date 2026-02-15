import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface GovUKTagProps {
  children: ReactNode
  color?:
    | 'grey'
    | 'green'
    | 'red'
    | 'yellow'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'orange'
}

export function GovUKTag({ children, color }: GovUKTagProps) {
  const colorClass = color ? `govuk-tag--${color}` : ''
  const classes = ['govuk-tag', colorClass].filter(Boolean).join(' ')

  return <strong className={classes}>{children}</strong>
}
