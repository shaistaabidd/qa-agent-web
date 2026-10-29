import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

import { OTP_PATH } from '@/features/auth/auth';
import type { LoginFormValues } from '@/features/auth/LoginForm';
import type { SignInPayload } from '@/features/auth/model/types';
import { startOtpTimer } from '@/features/auth/otpTimer';
import {
  clearPasswordResetRedirect,
  setLoginEmail,
  setOtpFlagAtEntry,
} from '@/features/auth/utils/flowStorage';
import { toastUnhandledError } from '@/features/auth/utils/mutationError';
import { rememberPostLoginRedirect } from '@/features/auth/utils/redirect';
import { finishSignIn } from '@/features/auth/utils/session';
import { useFeatureFlags } from '@/features/feature-flags';
import { LOGIN_USER } from '@/graphql/mutations/authMutations';

export function useLoginMutation() {
  const navigate = useNavigate();
  const { isEnabled, loaded } = useFeatureFlags();
  const [loginUser, { loading }] = useMutation<{ loginUser?: SignInPayload }>(LOGIN_USER);

  async function submit(values: LoginFormValues) {
    try {
      const result = await loginUser({
        variables: {
          email: values.email,
          password: values.password,
        },
      });

      clearPasswordResetRedirect();
      rememberPostLoginRedirect();

      // otp_enabled is off for this user (or their role): the API signed them in already.
      const { token, user } = result.data?.loginUser ?? {};
      if (token && user) {
        finishSignIn(token, user);
        return;
      }

      setLoginEmail(values.email);
      setOtpFlagAtEntry(loaded ? isEnabled('otpEnabled') : null);
      startOtpTimer();
      await navigate(OTP_PATH);
    } catch (error) {
      toastUnhandledError(error);
    }
  }

  return {
    isPending: loading,
    submit,
  };
}
