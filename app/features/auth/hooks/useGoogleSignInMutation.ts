import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

import type { AuthGraphQLUser } from '@/features/auth/model/types';
import { LOGIN_PATH } from '@/features/auth/paths';
import { googleCallbackCode, takeGoogleNonce } from '@/features/auth/utils/googleSignIn';
import { toastUnhandledError } from '@/features/auth/utils/mutationError';
import { finishSignIn } from '@/features/auth/utils/session';
import { SIGN_IN_WITH_GOOGLE } from '@/graphql/mutations/authMutations';
import { toast } from '@/shared/ui/toast';

type SignInWithGoogleData = {
  signInWithGoogle?: {
    token?: string | null;
    user?: AuthGraphQLUser | null;
  };
};

const EXPIRED_MESSAGE = 'This Google sign-in has expired. Please try again.';

export function useGoogleSignInMutation() {
  const navigate = useNavigate();
  const [signInWithGoogle] = useMutation(SIGN_IN_WITH_GOOGLE);

  async function backToLogin(message?: string) {
    if (message) {
      toast.error(message);
    }
    await navigate(LOGIN_PATH, { replace: true });
  }

  /** Reads the one-time code from the URL, then trades it (with this tab's nonce) for a session. */
  async function redeem() {
    const code = googleCallbackCode(window.location.hash);
    const nonce = takeGoogleNonce();
    // The code is single-use, but keep it out of the history and the address bar anyway.
    window.history.replaceState(window.history.state, '', window.location.pathname);

    if (!code || !nonce) {
      await backToLogin(EXPIRED_MESSAGE);
      return;
    }

    try {
      const result = await signInWithGoogle({ variables: { code, nonce } });
      const payload = (result.data as SignInWithGoogleData | null | undefined)?.signInWithGoogle;

      if (!payload?.token || !payload.user) {
        await backToLogin(EXPIRED_MESSAGE);
        return;
      }

      finishSignIn(payload.token, payload.user);
    } catch (error) {
      // GraphQL errors (e.g. sign-up closed, access revoked) are already toasted by the error link.
      toastUnhandledError(error);
      await backToLogin();
    }
  }

  return { redeem };
}
