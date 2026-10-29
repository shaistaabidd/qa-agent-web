import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

import { RESET_PASSWORD_PATH } from '@/features/auth/auth';
import type { AuthGraphQLUser } from '@/features/auth/model/types';
import type { OtpFormValues } from '@/features/auth/OtpForm';
import { clearOtpTimer, startOtpTimer } from '@/features/auth/otpTimer';
import {
  clearRedirectTo,
  getLoginEmail,
  getRedirectTo,
  setLoginEmail,
  setResetToken,
} from '@/features/auth/utils/flowStorage';
import { toastUnhandledError } from '@/features/auth/utils/mutationError';
import { finishSignIn } from '@/features/auth/utils/session';
import { RESEND_OTP, VALIDATE_OTP } from '@/graphql/mutations/authMutations';
import { toast } from '@/shared/ui/toast';

type ValidateOtpData = {
  validateOtp?: {
    resetPasswordToken?: string | null;
    token?: string | null;
    user?: AuthGraphQLUser;
  };
};

type ResendOtpData = {
  resendOtp?: {
    message?: string;
  };
};

/** Tells the API which emailed code this screen is for, so a newer login never replaces a reset code. */
function currentSignInPurpose() {
  return getRedirectTo() === RESET_PASSWORD_PATH ? 'password_reset' : 'login';
}

export function useOtpMutation({ onFailed }: { onFailed?: () => void } = {}) {
  const navigate = useNavigate();
  const [validateOtp, { loading: validating }] = useMutation(VALIDATE_OTP);
  const [resendOtp, { loading: resending }] = useMutation(RESEND_OTP);

  async function submit(values: OtpFormValues) {
    const email = getLoginEmail();
    if (!email) {
      toast.error('Session expired. Please log in again.');
      await navigate('/login', { replace: true });
      return;
    }

    try {
      const result = await validateOtp({
        variables: {
          email,
          otpCode: values.otp,
          purpose: currentSignInPurpose(),
        },
      });

      const payload = (result.data as ValidateOtpData | null | undefined)?.validateOtp;
      if (!payload) {
        toast.error('Unable to verify the code. Please try again.');
        return;
      }

      const redirectTo = getRedirectTo();
      if (redirectTo === RESET_PASSWORD_PATH) {
        setResetToken(payload.resetPasswordToken ?? null);
        setLoginEmail(null);
        clearRedirectTo();
        clearOtpTimer();
        await navigate(RESET_PASSWORD_PATH, { replace: true });
        return;
      }

      const token = payload.token;
      const user = payload.user;

      if (!token || !user) {
        toast.error('Unable to verify the code. Please try again.');
        return;
      }

      finishSignIn(token, user);
    } catch (error) {
      toastUnhandledError(error);
      onFailed?.();
    }
  }

  async function resend() {
    if (resending) {
      return false;
    }

    const email = getLoginEmail();
    if (!email) {
      toast.error('Session expired. Please log in again.');
      await navigate('/login', { replace: true });
      return false;
    }

    try {
      const result = await resendOtp({ variables: { email, purpose: currentSignInPurpose() } });
      const message = (result.data as ResendOtpData | null | undefined)?.resendOtp?.message;
      toast.success(message || 'Verification code resent successfully');
      startOtpTimer();
      return true;
    } catch (error) {
      toastUnhandledError(error);
      onFailed?.();
      return false;
    }
  }

  return {
    isPending: validating,
    isResending: resending,
    resend,
    submit,
  };
}
