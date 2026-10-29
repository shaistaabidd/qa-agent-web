import type { FeatureFlags } from '@/features/feature-flags';

/** An onboarding step, in order. Mirrors saas-api's OnboardingStepEnum. */
export type OnboardingStepName = 'step1' | 'step2';

export type OnboardingStep = {
  completed: boolean;
  /** Empty fields, named as in updateUser (firstName, lastName, phone). */
  missingFields: string[];
  position: number;
  step: OnboardingStepName;
};

/** Where the user stands in onboarding, as saas-api resolves it on every user. */
export type OnboardingStatus = {
  completed: boolean;
  currentStep: OnboardingStepName | null;
  required: boolean;
  steps: OnboardingStep[];
};

export type AuthGraphQLUser = {
  email: string;
  /** Resolved by saas-api for this user and role; absent on payloads that don't select it. */
  featureFlags?: FeatureFlags | null;
  firstName?: string | null;
  fullName?: string | null;
  id: string;
  imageUrl?: string | null;
  lastName?: string | null;
  /** saas-api onboarding; absent on payloads that don't select it. */
  onboarding?: OnboardingStatus | null;
  phone?: string | null;
  resetPasswordToken?: string | null;
  /** New email waiting for its code (requestEmailChange); null once applied. */
  unconfirmedEmail?: string | null;
  userType: string;
};

/** A login or sign-up payload: a session when otp_enabled is off for the user, else a code was emailed. */
export type SignInPayload = {
  message?: string;
  token?: string | null;
  user?: AuthGraphQLUser | null;
};

export type UserRole = 'super_admin' | 'user';

export const USER_ROLES: UserRole[] = ['super_admin', 'user'];

export function normalizeUserType(userType: string | null | undefined): UserRole | null {
  if (!userType) {
    return null;
  }

  const role = (userType.split('::').pop() ?? userType) as UserRole;
  return USER_ROLES.includes(role) ? role : null;
}

export function displayNameFromUser(user: AuthGraphQLUser) {
  const fromFull = user.fullName?.trim();
  if (fromFull) {
    return fromFull;
  }

  const fromParts = [user.firstName, user.lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(' ')
    .trim();

  return fromParts || user.email;
}
