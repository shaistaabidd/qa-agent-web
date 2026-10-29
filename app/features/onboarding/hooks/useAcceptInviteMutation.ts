import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import {
  applyGraphQLSession,
  type AuthGraphQLUser,
  hardNavigateAfterAuth,
  INVITE_EXPIRED_PATH,
  toastUnhandledError,
} from '@/features/auth';
import { ACCEPT_INVITATION } from '@/graphql/mutations/authMutations';
import { VALIDATE_INVITATION_TOKEN } from '@/graphql/queries/authQueries';
import { toast } from '@/shared/ui/toast';

import type { InviteSetupFormValues } from '../InviteSetupForm';

type ValidateInviteData = {
  validateInvitationToken?: {
    error?: string | null;
    valid?: boolean;
  };
};

type AcceptInviteData = {
  acceptInvitation?: {
    user?: AuthGraphQLUser;
    token?: string;
  };
};

export function useAcceptInviteMutation() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token')?.trim() ?? '';

  const {
    data,
    loading: validating,
    error: validateError,
  } = useQuery(VALIDATE_INVITATION_TOKEN, {
    fetchPolicy: 'network-only',
    skip: !token,
    variables: { token },
  });

  const [acceptInvitation, { loading: accepting }] = useMutation(ACCEPT_INVITATION);

  useEffect(() => {
    if (!token) {
      void navigate(INVITE_EXPIRED_PATH, { replace: true });
      return;
    }

    if (validateError) {
      void navigate(INVITE_EXPIRED_PATH, { replace: true });
      return;
    }

    const validation = (data as ValidateInviteData | null | undefined)?.validateInvitationToken;
    if (validation && validation.valid === false) {
      void navigate(INVITE_EXPIRED_PATH, { replace: true });
    }
  }, [data, navigate, token, validateError]);

  async function submit(values: InviteSetupFormValues) {
    if (!token) {
      await navigate(INVITE_EXPIRED_PATH, { replace: true });
      return;
    }

    try {
      const result = await acceptInvitation({
        variables: {
          password: values.password,
          passwordConfirmation: values.confirmPassword,
          token,
        },
      });

      const payload = (result.data as AcceptInviteData | null | undefined)?.acceptInvitation;
      const authToken = payload?.token;
      const user = payload?.user;

      if (!authToken || !user) {
        toast.error('Unable to accept invitation. Please try again.');
        return;
      }

      const sessionUser = applyGraphQLSession(authToken, user);
      toast.success('You have accepted the invite successfully');
      hardNavigateAfterAuth(sessionUser);
    } catch (error) {
      toastUnhandledError(error);
    }
  }

  return {
    isPending: accepting || validating,
    isValidating: validating,
    submit,
    token,
  };
}
