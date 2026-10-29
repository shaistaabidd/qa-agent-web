import { useSyncExternalStore } from 'react';

import { RESET_PASSWORD_PATH } from './auth';
import { useOtpFlagGuard } from './hooks/useOtpFlagGuard';
import { useOtpMutation } from './hooks/useOtpMutation';
import { OtpForm } from './OtpForm';
import { getLoginEmail, getRedirectTo } from './utils/flowStorage';

const subscribeNoop = () => () => {};

export function OtpPage() {
  const email = useSyncExternalStore(subscribeNoop, getLoginEmail, () => null);
  const redirectTo = useSyncExternalStore(subscribeNoop, getRedirectTo, () => null);
  const isPasswordReset = redirectTo === RESET_PASSWORD_PATH;
  const refreshFlags = useOtpFlagGuard(isPasswordReset);
  const { isPending, isResending, resend, submit } = useOtpMutation({ onFailed: refreshFlags });
  const backLabel = isPasswordReset ? 'Back to forgot password' : 'Back to login';

  return (
    <OtpForm
      backLabel={backLabel}
      description={
        email
          ? `Enter the 6-digit verification code sent to ${email}`
          : 'Enter your 6-digit verification code'
      }
      isPending={isPending}
      isResending={isResending}
      onResend={resend}
      onSubmit={submit}
      submitLabel={isPasswordReset ? 'Verify Code' : undefined}
    />
  );
}
