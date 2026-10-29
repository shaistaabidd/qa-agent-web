import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

import { OTP_PATH, RESET_PASSWORD_PATH } from '@/features/auth/auth';
import type { ForgotPasswordFormValues } from '@/features/auth/ForgotPasswordForm';
import { startOtpTimer } from '@/features/auth/otpTimer';
import { setLoginEmail, setRedirectTo } from '@/features/auth/utils/flowStorage';
import { toastUnhandledError } from '@/features/auth/utils/mutationError';
import { FORGOT_PASSWORD } from '@/graphql/mutations/authMutations';
import { toast } from '@/shared/ui/toast';

type ForgotPasswordData = {
  sendResetPasswordInstructions?: {
    message?: string;
  };
};

export function useForgotPasswordMutation() {
  const navigate = useNavigate();
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);

  async function submit(values: ForgotPasswordFormValues) {
    try {
      const result = await forgotPassword({
        variables: { email: values.email },
      });

      setLoginEmail(values.email);
      setRedirectTo(RESET_PASSWORD_PATH);
      startOtpTimer();

      toast.success(
        (result.data as ForgotPasswordData | null | undefined)?.sendResetPasswordInstructions
          ?.message || 'Check your email for a verification code.',
      );

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
