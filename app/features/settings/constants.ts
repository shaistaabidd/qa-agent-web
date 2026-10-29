import type { AccountTabValue } from './types';

// Mirror saas-api's OneTimePassword::RESEND_COOLDOWN.
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

export const TOAST_POSITION = 'bottom-right' as const;

export const SETTINGS_TABS: { label: string; value: AccountTabValue }[] = [
  { label: 'Account', value: 'account' },
  { label: 'Security', value: 'security' },
];
