import type { AuthGraphQLUser, OnboardingStepName, UserRole } from '@/features/auth/model/types';
import { normalizeUserType } from '@/features/auth/model/types';

export const SETUP_PATHS = {
  addCalendar: '/add-calendar',
  inviteExpired: '/invite-expired',
  onboardingStep1: '/onboarding/step-1',
  onboardingStep2: '/onboarding/step-2',
  paymentFailed: '/payment-failed',
  paymentSuccess: '/payment-success',
  pricing: '/pricing',
  profileSetup: '/profile-setup',
  setPassword: '/set-password',
  signDocument: '/sign-document',
} as const;

/** Where each saas-api onboarding step is completed. */
export const ONBOARDING_STEP_PATHS: Record<OnboardingStepName, string> = {
  step1: SETUP_PATHS.onboardingStep1,
  step2: SETUP_PATHS.onboardingStep2,
};

/**
 * The saas-api onboarding page the user must finish next: the first incomplete step, in order,
 * as the API reports it (`onboarding.currentStep`). Null when onboarding is done or doesn't apply.
 * A step this app doesn't know yet falls back to the first known incomplete step, so the user stays gated.
 */
export function onboardingStepPath(user: AuthGraphQLUser) {
  if (user.onboarding?.completed !== false || user.onboarding.currentStep == null) {
    return null;
  }

  const known = knownStepPath(user.onboarding.currentStep);
  if (known) {
    return known;
  }

  const firstIncomplete = user.onboarding.steps.find(
    (step) => !step.completed && knownStepPath(step.step),
  );
  return knownStepPath(firstIncomplete?.step ?? 'step1');
}

/** Own keys only, so a step named `constructor` is unknown instead of an inherited member. */
function knownStepPath(step: string) {
  return Object.hasOwn(ONBOARDING_STEP_PATHS, step)
    ? ONBOARDING_STEP_PATHS[step as OnboardingStepName]
    : undefined;
}

/** True for a completed onboarding step the user may go back to while finishing a later one. */
function isCompletedOnboardingStep(user: AuthGraphQLUser, pathname: string) {
  return Boolean(
    user.onboarding?.steps.some(
      (step) => step.completed && ONBOARDING_STEP_PATHS[step.step] === pathname,
    ),
  );
}

export function needsOnboarding(user: AuthGraphQLUser) {
  const role = normalizeUserType(user.userType);
  // saas-api roles onboard through its steps (onboardingStepPath); super admins never do.
  if (role === 'super_admin' || role === 'user') {
    return false;
  }

  return !user.onboardingCompleted;
}

export function needsSubscription(user: AuthGraphQLUser) {
  const role = normalizeUserType(user.userType);
  if (role === 'super_clinic_admin') {
    return !user.subscriptionPaid;
  }

  return false;
}

export function needsDocumentSigning(user: AuthGraphQLUser) {
  const role = normalizeUserType(user.userType);
  if (
    role === 'client' ||
    role === 'practitioner' ||
    role === 'super_clinic_admin' ||
    role === 'clinic_admin'
  ) {
    return !user.documentSigned;
  }

  return false;
}

export function needsCalendarSetup(user: AuthGraphQLUser) {
  const role = normalizeUserType(user.userType);
  if (role === 'practitioner') {
    return !user.calendarLink;
  }

  return false;
}

export function getNextRequiredStep(user: AuthGraphQLUser): string | null {
  const role = normalizeUserType(user.userType);
  if (role === 'super_admin') {
    return null;
  }

  const onboardingStep = onboardingStepPath(user);
  if (onboardingStep) {
    return onboardingStep;
  }

  if (needsOnboarding(user)) {
    return SETUP_PATHS.profileSetup;
  }

  if (needsSubscription(user)) {
    return SETUP_PATHS.pricing;
  }

  if (needsDocumentSigning(user)) {
    return SETUP_PATHS.signDocument;
  }

  if (needsCalendarSetup(user)) {
    return SETUP_PATHS.addCalendar;
  }

  return null;
}

export function pathAfterGraphQLAuth(user: AuthGraphQLUser) {
  return getNextRequiredStep(user) ?? '/dashboard';
}

export function isSetupPath(pathname: string) {
  return (
    pathname === SETUP_PATHS.onboardingStep1 ||
    pathname === SETUP_PATHS.onboardingStep2 ||
    pathname === SETUP_PATHS.profileSetup ||
    pathname === SETUP_PATHS.pricing ||
    pathname === SETUP_PATHS.signDocument ||
    pathname === SETUP_PATHS.addCalendar ||
    pathname === SETUP_PATHS.paymentSuccess ||
    pathname === SETUP_PATHS.paymentFailed
  );
}

export function allowedPathForIncompleteSetup(user: AuthGraphQLUser, pathname: string): boolean {
  const next = getNextRequiredStep(user);
  if (!next) {
    return !isSetupPath(pathname) || pathname === SETUP_PATHS.paymentSuccess;
  }

  if (pathname === next) {
    return true;
  }

  // Going back to edit an earlier onboarding step is fine; skipping ahead is not.
  if (onboardingStepPath(user) === next && isCompletedOnboardingStep(user, pathname)) {
    return true;
  }

  if (
    next === SETUP_PATHS.pricing &&
    (pathname === SETUP_PATHS.paymentSuccess || pathname === SETUP_PATHS.paymentFailed)
  ) {
    return true;
  }

  return false;
}

export function roleLandingPath(_role: UserRole | null) {
  return '/dashboard';
}
