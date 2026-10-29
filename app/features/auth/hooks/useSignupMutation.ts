import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

import { OTP_PATH } from '@/features/auth/auth';
import type { SignInPayload } from '@/features/auth/model/types';
import { startOtpTimer } from '@/features/auth/otpTimer';
import type { SignupFormValues } from '@/features/auth/SignupForm';
import {
  clearPasswordResetRedirect,
  setLoginEmail,
  setOtpFlagAtEntry,
} from '@/features/auth/utils/flowStorage';
import { toastUnhandledError } from '@/features/auth/utils/mutationError';
import { useFeatureFlags } from '@/features/feature-flags';
import { REGISTER_USER } from '@/graphql/mutations/authMutations';

/** Registers, then continues on the OTP screen: sign-up always confirms the email with a code. */
export function useSignupMutation({ onFailed }: { onFailed?: () => void } = {}) {
  const navigate = useNavigate();
  const { isEnabled, loaded } = useFeatureFlags();
  const [registerUser, { loading }] = useMutation<{ registerUser?: SignInPayload }>(REGISTER_USER);

  async function submit(values: SignupFormValues) {
    try {
      await registerUser({
        variables: {
          email: values.email.trim(),
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          password: values.password,
          passwordConfirmation: values.confirmPassword,
        },
      });

      clearPasswordResetRedirect();
      setLoginEmail(values.email.trim());
      setOtpFlagAtEntry(loaded ? isEnabled('otpEnabled') : null);
      startOtpTimer();
      await navigate(OTP_PATH);
    } catch (error) {
      toastUnhandledError(error);
      onFailed?.();
    }
  }

  return {
    isPending: loading,
    submit,
  };
}
