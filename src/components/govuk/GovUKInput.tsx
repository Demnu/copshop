import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'

interface GovUKInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: '2' | '3' | '4' | '5' | '10' | '20' | '30' | 'full'
}

export function GovUKInput({ width, className, ...props }: GovUKInputProps) {
  const widthClass =
    width && width !== 'full' ? `govuk-input--width-${width}` : ''
  const classes = ['govuk-input', widthClass, className]
    .filter(Boolean)
    .join(' ')

  return <input className={classes} {...props} />
}
