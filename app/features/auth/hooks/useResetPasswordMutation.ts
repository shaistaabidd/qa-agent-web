import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';

import { LOGIN_PATH } from '@/features/auth/auth';
import type { AuthGraphQLUser } from '@/features/auth/model/types';
import type { ResetPasswordFormValues } from '@/features/auth/ResetPasswordForm';
import { clearAuthFlowKeys, getResetToken } from '@/features/auth/utils/flowStorage';
import { toastUnhandledError } from '@/features/auth/utils/mutationError';
import { applyGraphQLSession, hardNavigateAfterAuth } from '@/features/auth/utils/session';
import { RESET_PASSWORD } from '@/graphql/mutations/authMutations';
import { toast } from '@/shared/ui/toast';

type ResetPasswordData = {
  setPassword?: {
    token?: string;
    user?: AuthGraphQLUser;
  };
};

export function useResetPasswordMutation() {
  const navigate = useNavigate();
  const [setPassword, { loading }] = useMutation(RESET_PASSWORD);

  async function submit(values: ResetPasswordFormValues) {
    const resetPasswordToken = getResetToken();
    if (!resetPasswordToken) {
      toast.error('Your reset session has expired. Please request a new verification code.');
      await navigate(LOGIN_PATH, { replace: true });
      return;
    }

    try {
      const result = await setPassword({
        variables: {
          password: values.password,
          passwordConfirmation: values.confirmPassword,
          resetPasswordToken,
        },
      });

      const payload = (result.data as ResetPasswordData | null | undefined)?.setPassword;
      const token = payload?.token;
      const user = payload?.user;

      if (!token || !user) {
        toast.error('Unable to reset password. Please try again.');
        return;
      }

      const sessionUser = applyGraphQLSession(token, user);
      clearAuthFlowKeys();
      hardNavigateAfterAuth(sessionUser);
    } catch (error) {
      toastUnhandledError(error);
    }
  }

  return {
    isPending: loading,
    submit,
  };
}
