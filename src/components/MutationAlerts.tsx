import type { UseMutationResult } from '@tanstack/react-query'
import { MutationError } from './MutationError'
import { MutationSuccess } from './MutationSuccess'

interface MutationAlertsProps<
  TData = unknown,
  TError = Error,
  TVariables = void,
> {
  mutation: UseMutationResult<TData, TError, TVariables>
  successMessage: string
  errorMessage: string
  hideSuccessWhen?: (data: TData) => boolean
}

export function MutationAlerts<
  TData = unknown,
  TError = Error,
  TVariables = void,
>({
  mutation,
  successMessage,
  errorMessage,
  hideSuccessWhen,
}: MutationAlertsProps<TData, TError, TVariables>) {
  const shouldShowSuccess =
    mutation.isSuccess &&
    (!hideSuccessWhen || !hideSuccessWhen(mutation.data as TData))

  return (
    <>
      {shouldShowSuccess && (
        <MutationSuccess
          successMessage={successMessage}
          onClose={() => mutation.reset()}
        />
      )}
      {mutation.isError && (
        <MutationError error={mutation.error} errorMessage={errorMessage} />
      )}
    </>
  )
}
