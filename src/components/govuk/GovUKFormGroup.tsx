import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

interface GovUKFormGroupProps {
  label: string
  htmlFor: string
  hint?: string
  children: ReactNode
}

export function GovUKFormGroup({
  label,
  htmlFor,
  hint,
  children,
}: GovUKFormGroupProps) {
  return (
    <div className="govuk-form-group">
      <label className="govuk-label" htmlFor={htmlFor}>
        {label}
      </label>
      {hint && <div className="govuk-hint">{hint}</div>}
      {children}
    </div>
  )
}
