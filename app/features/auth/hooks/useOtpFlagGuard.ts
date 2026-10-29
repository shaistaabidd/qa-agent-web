import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { LOGIN_PATH } from '@/features/auth/auth';
import { clearOtpTimer } from '@/features/auth/otpTimer';
import { clearAuthFlowKeys, getOtpFlagAtEntry } from '@/features/auth/utils/flowStorage';
import { useFeatureFlags } from '@/features/feature-flags';
import { toast } from '@/shared/ui/toast';

/**
 * Leaves the code screen for login once the code step was switched off while the user was on it:
 * the API signs them in with the password alone now, and the screen can no longer finish. Only
 * acts when the flag was seen on at entry (the public flag is read for the sign-up role, so an
 * "off" that was never on proves nothing for this user), and never on the password-reset flow.
 * Returns a function that re-reads the flag, for after a failed submit or resend.
 */
export function useOtpFlagGuard(isPasswordReset: boolean) {
  const navigate = useNavigate();
  const { isEnabled, loaded, refresh } = useFeatureFlags();
  const switchedOff = !isPasswordReset && loaded && !isEnabled('otpEnabled');

  useEffect(() => {
    if (!switchedOff || getOtpFlagAtEntry() !== true) {
      return;
    }

    clearAuthFlowKeys();
    clearOtpTimer();
    toast.info('Verification codes are no longer required. Please log in again.');
    void navigate(LOGIN_PATH, { replace: true });
  }, [navigate, switchedOff]);

  return refresh;
}
