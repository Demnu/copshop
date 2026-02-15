import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode } from 'react'

export interface GovUKSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface GovUKSelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'children'
> {
  /** Array of options to render */
  options?: GovUKSelectOption[]
  /** Placeholder option (e.g., "Select an option"). If provided, adds an empty option at the top */
  placeholder?: string
  /** Custom children - use this for complex option rendering or option groups */
  children?: ReactNode
}

/**
 * GOV.UK select component
 *
 * Can be used in two ways:
 * 1. With `options` prop for simple lists
 * 2. With `children` for complex rendering (option groups, etc.)
 *
 * @example
 * // Simple usage with options array
 * <GovUKSelect
 *   options={[
 *     { value: 1, label: 'Option 1' },
 *     { value: 2, label: 'Option 2' }
 *   ]}
 *   placeholder="Choose an option"
 * />
 *
 * @example
 * // With children for custom rendering
 * <GovUKSelect>
 *   <option value="">Select...</option>
 *   <option value="1">Custom option</option>
 * </GovUKSelect>
 */
export function GovUKSelect({
  className,
  options,
  placeholder,
  children,
  ...props
}: GovUKSelectProps) {
  const classes = ['govuk-select', className].filter(Boolean).join(' ')

  return (
    <select className={classes} {...props}>
      {children ? (
        children
      ) : (
        <>
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </>
      )}
    </select>
  )
}
