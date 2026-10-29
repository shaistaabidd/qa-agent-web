import type { FeatureFlags } from '@/features/feature-flags';

export type CoAdminStatus = 'active' | 'archived' | 'pending';

export type CoAdmin = {
  email: string;
  /** Resolved by saas-api for this user (role and per-user settings). */
  featureFlags?: Pick<FeatureFlags, 'impersonationEnabled'> | null;
  firstName?: string | null;
  fullName?: string | null;
  id: string;
  imageUrl?: string | null;
  invitationSentAt?: string | null;
  lastName?: string | null;
  revokeAccess?: boolean | null;
  status: CoAdminStatus;
};

export type CoAdminFormValues = {
  firstName: string;
  lastName: string;
};

/** `undefined` keeps the current photo, `null` removes it, a file replaces it. */
export type CoAdminPhotoChange = File | null | undefined;

/** An address the API skipped while inviting the rest of the batch. */
export type RejectedInvite = {
  email: string;
  message: string;
};

export type InviteResult = {
  message: string;
  rejected: RejectedInvite[];
};
