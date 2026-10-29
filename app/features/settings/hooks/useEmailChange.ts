import { useMutation } from '@apollo/client/react';

import { type AuthGraphQLUser } from '@/features/auth';
import {
  CONFIRM_EMAIL_CHANGE,
  REQUEST_EMAIL_CHANGE,
  RESEND_EMAIL_CHANGE_CODE,
} from '@/graphql/mutations/authMutations';

import { showSuccess, syncSessionUser } from './syncSessionUser';

type RequestEmailChangeData = {
  requestEmailChange?: { message?: string; user?: AuthGraphQLUser };
};
type ResendEmailChangeCodeData = { resendEmailChangeCode?: { message?: string } };
type ConfirmEmailChangeData = { confirmEmailChange?: { user?: AuthGraphQLUser } };

/**
 * New email + current password. With email_change_otp_enabled on for the user, one code is
 * sent to the new address and the login email changes only after it is confirmed; with it
 * off, the API changes the email at once.
 */
export function useEmailChange() {
  const [requestEmailChange] = useMutation<RequestEmailChangeData>(REQUEST_EMAIL_CHANGE);
  const [resendEmailChangeCode] = useMutation<ResendEmailChangeCodeData>(RESEND_EMAIL_CHANGE_CODE);
  const [confirmEmailChange] = useMutation<ConfirmEmailChangeData>(CONFIRM_EMAIL_CHANGE);

  /** Resolves to whether a code must now be confirmed (false: the email already changed). */
  async function requestNewEmail(email: string, currentPassword: string) {
    const result = await requestEmailChange({ variables: { currentPassword, email } });
    const payload = result.data?.requestEmailChange;
    const needsCode = Boolean(payload?.user?.unconfirmedEmail);

    if (!needsCode) {
      syncSessionUser(payload?.user);
    }
    showSuccess(payload?.message || (needsCode ? 'Verification code sent.' : 'Email changed.'));
    return needsCode;
  }

  async function resendNewEmailCode() {
    const result = await resendEmailChangeCode();

    showSuccess(result.data?.resendEmailChangeCode?.message || 'Verification code resent.');
  }

  async function confirmNewEmail(otp: string) {
    const result = await confirmEmailChange({ variables: { otpCode: otp } });

    syncSessionUser(result.data?.confirmEmailChange?.user);
    showSuccess('Login email changed successfully.');
  }

  return { confirmNewEmail, requestNewEmail, resendNewEmailCode };
}
