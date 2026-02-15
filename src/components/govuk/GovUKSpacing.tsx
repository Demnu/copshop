import 'govuk-frontend/dist/govuk/govuk-frontend.min.css'
import { ReactNode, CSSProperties } from 'react'

interface GovUKSpacingProps {
  children: ReactNode
  mb?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  mt?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  style?: CSSProperties
  className?: string
}

/**
 * Wrapper component for GOV.UK spacing scale
 * Uses the official spacing units from the design system:
 * 0 = 0, 1 = 5px, 2 = 10px, 3 = 15px, 4 = 20px, 5 = 25px, 6 = 30px, 7 = 40px, 8 = 50px, 9 = 60px
 */
export function GovUKSpacing({
  children,
  mb,
  mt,
  style,
  className,
}: GovUKSpacingProps) {
  const classes = ['govuk-spacing', className].filter(Boolean).join(' ')

  const customStyle: CSSProperties = {
    ...style,
    ...(mb !== undefined && { marginBottom: `${mb * 5}px` }),
    ...(mt !== undefined && { marginTop: `${mt * 5}px` }),
  }

  return (
    <div className={classes} style={customStyle}>
      {children}
    </div>
  )
}

// Preset spacing components for common use cases
export function GovUKSection({ children }: { children: ReactNode }) {
  return <div className="govuk-!-margin-bottom-8">{children}</div>
}

export function GovUKButtonGroup({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        marginBottom: '30px',
      }}
    >
      {children}
    </div>
  )
}
