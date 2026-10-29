import { useMutation } from '@apollo/client/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

import {
  applyGraphQLSession,
  type AuthGraphQLUser,
  getNextRequiredStep,
  hardNavigateAfterAuth,
  toastUnhandledError,
  useAuthStore,
} from '@/features/auth';
import { SAVE_ONBOARDING_STEP } from '@/graphql/mutations/userMutations';
import { toast } from '@/shared/ui/toast';

type SaveOnboardingStepData = { updateUser?: { user?: AuthGraphQLUser | null } | null };

export type OnboardingStepAttributes = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

/**
 * Saves a step, then goes where the user's new onboarding status says: the next missing step,
 * or (once every step is done) into the app.
 */
export function useSaveOnboardingStep() {
  const navigate = useNavigate();
  const [save, { loading }] = useMutation<SaveOnboardingStepData>(SAVE_ONBOARDING_STEP);
  // `loading` only flips after a re-render, so a fast double click would still get through.
  const inFlight = useRef(false);

  async function submit(attributes: OnboardingStepAttributes) {
    if (inFlight.current) {
      return;
    }
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    inFlight.current = true;
    try {
      const result = await save({ variables: { attributes } });
      const user = result.data?.updateUser?.user;
      if (!user) {
        toast.error('Unable to save your details. Please try again.');
        return;
      }

      const sessionUser = applyGraphQLSession(token, user);
      const next = getNextRequiredStep(sessionUser);
      if (next) {
        await navigate(next, { replace: true });
        return;
      }

      hardNavigateAfterAuth(sessionUser);
    } catch (error) {
      toastUnhandledError(error);
    } finally {
      inFlight.current = false;
    }
  }

  return { isPending: loading, submit };
}
