import { Container, ContainerProps } from '@mui/material'
import { ReactNode } from 'react'

interface PageContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  children: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function PageContainer({
  children,
  maxWidth = 'lg',
  ...props
}: PageContainerProps) {
  return (
    <Container maxWidth={maxWidth} sx={{ py: 4, ...props.sx }} {...props}>
      {children}
    </Container>
  )
}
