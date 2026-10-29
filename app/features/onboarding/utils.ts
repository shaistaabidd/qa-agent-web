import { type AuthMe } from '@/features/auth';
import { Role, UserStatus } from '@/shared/lib/constants';

import {
  LICENSE_STATE_CODE_BY_VALUE,
  LICENSE_STATES,
  ONBOARDING_PATHS,
  SPECIALTIES,
  US_STATE_CODES,
} from './constants';
import type { OnboardingRole, ProviderOnboardingDraft } from './types';

export function getSpecialtyLabel(value: string) {
  return SPECIALTIES.find((item) => item.value === value)?.label ?? value;
}

export function getStateLabel(value: string) {
  const normalized = value.trim();
  const byCodeIndex = US_STATE_CODES.findIndex((code) => code === normalized.toUpperCase());
  if (byCodeIndex >= 0) {
    return LICENSE_STATES[byCodeIndex]?.label ?? normalized;
  }

  return LICENSE_STATES.find((item) => item.value === normalized)?.label ?? normalized;
}

export function toUsStateCode(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const upper = normalized.toUpperCase();
  if ((US_STATE_CODES as readonly string[]).includes(upper) || upper === 'DC') {
    return upper;
  }

  const bySlug = LICENSE_STATES.findIndex((item) => item.value === normalized);
  if (bySlug >= 0) {
    return US_STATE_CODES[bySlug] ?? null;
  }

  const byLabel = LICENSE_STATES.findIndex(
    (item) => item.label.toLowerCase() === normalized.toLowerCase(),
  );
  if (byLabel >= 0) {
    return US_STATE_CODES[byLabel] ?? null;
  }

  return LICENSE_STATE_CODE_BY_VALUE[normalized.toLowerCase()] ?? null;
}

export function toUsStateCodes(values: string[]) {
  return values
    .map((value) => toUsStateCode(value))
    .filter((value): value is string => Boolean(value));
}

export function toLicenseStateSlug(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return trimmed;
  }

  if (LICENSE_STATE_CODE_BY_VALUE[trimmed.toLowerCase()]) {
    return trimmed.toLowerCase();
  }

  const index = US_STATE_CODES.findIndex((code) => code === trimmed.toUpperCase());

  return index >= 0 ? LICENSE_STATES[index].value : trimmed.toLowerCase();
}

export function sameLicensedStates(
  left: string[] | undefined = [],
  right: string[] | undefined = [],
) {
  const normalize = (values: string[] | undefined) =>
    (Array.isArray(values) ? values : [])
      .map((item) => {
        const value = typeof item === 'string' ? item : String(item ?? '');
        return toUsStateCode(value) || value.trim().toUpperCase();
      })
      .filter(Boolean)
      .sort()
      .join(',');

  return normalize(left) === normalize(right);
}

export function formatFullName(draft: ProviderOnboardingDraft) {
  return [draft.firstName, draft.lastName].filter(Boolean).join(' ').trim();
}

export function formatClinicAddress(draft: ProviderOnboardingDraft) {
  const street = [draft.addressLine1, draft.addressLine2].filter(Boolean).join(', ').trim();
  const locality = [draft.city, draft.state].filter(Boolean).join(', ');

  return [street, locality].filter(Boolean).join(', ');
}

export function onboardingPathForUserStatus(status: string | null | undefined) {
  if (status === UserStatus.PENDING) {
    return ONBOARDING_PATHS.pending;
  }

  if (status === UserStatus.REJECTED) {
    return ONBOARDING_PATHS.declined;
  }

  if (status === UserStatus.ACTIVE) {
    return ONBOARDING_PATHS.approved;
  }

  return null;
}

export function isStripeComplete(me?: AuthMe | null) {
  const connect = me?.pharmacy?.connect ?? me?.provider?.connect;
  return connect?.status === 'complete';
}

function submittedOnboardingProfile(me: AuthMe) {
  return Boolean(me.pharmacy || me.provider);
}

export function needsOnboardingStripe(me: AuthMe) {
  return (
    submittedOnboardingProfile(me) &&
    !isStripeComplete(me) &&
    me.status !== UserStatus.REJECTED &&
    me.status !== UserStatus.ACTIVE
  );
}

export function approvalPathAfterStripe(status: string | null | undefined) {
  return status === UserStatus.REJECTED ? ONBOARDING_PATHS.declined : ONBOARDING_PATHS.pending;
}

export function isPharmacyRole(role: OnboardingRole) {
  return role === Role.PHARMACY;
}

export function isPatientRole(role: OnboardingRole) {
  return role === Role.PATIENT;
}

export function onboardingStartPath(role: OnboardingRole) {
  return isPharmacyRole(role) ? ONBOARDING_PATHS.pharmacy : ONBOARDING_PATHS.personal;
}

function onboardingRoleFromMe(role: AuthMe['role']): OnboardingRole {
  if (role === Role.PHARMACY || role === Role.PATIENT) {
    return role;
  }

  return Role.PROVIDER;
}

export function pathAfterSignupMe(me: AuthMe) {
  const role = onboardingRoleFromMe(me.role);
  const submitted = submittedOnboardingProfile(me);

  if (me.status === UserStatus.PENDING && !submitted) {
    return onboardingStartPath(role);
  }

  if (needsOnboardingStripe(me)) {
    return ONBOARDING_PATHS.stripe;
  }

  return onboardingPathForUserStatus(me.status) ?? onboardingStartPath(role);
}

export function invitedRoleFromSearch(role: string | null): OnboardingRole {
  return role === Role.PATIENT ? Role.PATIENT : Role.PHARMACY;
}

export function inviteReviewPath() {
  return `${ONBOARDING_PATHS.review}?from=invite`;
}

export function isInviteReview(searchParams: URLSearchParams) {
  return searchParams.get('from') === 'invite';
}

export function formatPharmacyAddress(draft: ProviderOnboardingDraft) {
  const line = [draft.addressLine1, draft.addressLine2].filter(Boolean).join(', ').trim();
  const locality = [draft.state, draft.city].filter(Boolean).join(' ');
  const tail = [locality, draft.zip].filter(Boolean).join(', ');

  return [line, tail].filter(Boolean).join(', ');
}
