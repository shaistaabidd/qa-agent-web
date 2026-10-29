import { CombinedGraphQLErrors, LinkError } from '@apollo/client/errors';

import { toast } from '@/shared/ui/toast';

/** Link and GraphQL errors are already toasted by the error link. Anything else surfaces here. */
export function toastUnhandledError(
  error: unknown,
  fallback = 'Something went wrong on our side. Please try again.',
) {
  if (LinkError.is(error) || CombinedGraphQLErrors.is(error)) {
    return;
  }

  // Unexpected exceptions carry developer wording, so users only ever see the fallback.
  toast.error(fallback);
}
