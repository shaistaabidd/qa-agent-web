import { type AuthMeConnect } from '@/features/auth';

export type StripeConnectState = {
  detailsSubmitted: boolean;
  status: AuthMeConnect['status'];
};

export type AccountProfile = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  pendingEmail: string | null;
  photoUrl: string;
};

export type AccountTabValue = 'account' | 'security';
