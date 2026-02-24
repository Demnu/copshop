import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { InputHTMLAttributes, ReactNode } from 'react'

interface GovUKCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text label for the checkbox */
  label: ReactNode
  /** Optional hint text */
  hint?: string
  /** Strike through label when checked */
  strikethrough?: boolean
}

/**
 * GOV.UK checkbox component
 * 
 * @example
 * <GovUKCheckbox
 *   label="Subscribe to newsletter"
 *   name="newsletter"
 *   checked={checked}
 *   onChange={handleChange}
 * />
 */
export function GovUKCheckbox({ label, hint, id, className, strikethrough, checked, ...props }: GovUKCheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
  const hintId = hint ? `${checkboxId}-hint` : undefined

  return (
    <div className={`govuk-checkboxes__item ${className || ''}`.trim()}>
      <input
        className="govuk-checkboxes__input"
        type="checkbox"
        id={checkboxId}
        aria-describedby={hintId}
        checked={checked}
        {...props}
      />
      <label
        className="govuk-label govuk-checkboxes__label"
        htmlFor={checkboxId}
        style={strikethrough && checked ? { textDecoration: 'line-through', opacity: 0.6 } : undefined}
      >
        {label}
      </label>
      {hint && (
        <div id={hintId} className="govuk-hint govuk-checkboxes__hint">
          {hint}
        </div>
      )}
    </div>
  )
}
