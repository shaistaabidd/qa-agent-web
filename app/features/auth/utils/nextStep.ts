import type { AuthGraphQLUser, OnboardingStepName, UserRole } from '@/features/auth/model/types';
import { normalizeUserType } from '@/features/auth/model/types';
import { HOME_PATH } from '@/features/auth/paths';

export const SETUP_PATHS = {
  inviteExpired: '/invite-expired',
  onboardingStep1: '/onboarding/step-1',
  onboardingStep2: '/onboarding/step-2',
  setPassword: '/set-password',
} as const;

/** Where each saas-api onboarding step is completed. */
export const ONBOARDING_STEP_PATHS: Record<OnboardingStepName, string> = {
  step1: SETUP_PATHS.onboardingStep1,
  step2: SETUP_PATHS.onboardingStep2,
};

/**
 * The onboarding page the user must finish next: the first incomplete step, in order,
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

/** The page a signed-in user must finish before using the app, or null. Super admins never onboard. */
export function getNextRequiredStep(user: AuthGraphQLUser): string | null {
  if (normalizeUserType(user.userType) === 'super_admin') {
    return null;
  }

  return onboardingStepPath(user) ?? null;
}

export function pathAfterGraphQLAuth(user: AuthGraphQLUser) {
  return getNextRequiredStep(user) ?? HOME_PATH;
}

export function isSetupPath(pathname: string) {
  return pathname === SETUP_PATHS.onboardingStep1 || pathname === SETUP_PATHS.onboardingStep2;
}

export function allowedPathForIncompleteSetup(user: AuthGraphQLUser, pathname: string): boolean {
  const next = getNextRequiredStep(user);
  if (!next) {
    return !isSetupPath(pathname);
  }

  if (pathname === next) {
    return true;
  }

  // Going back to edit an earlier onboarding step is fine; skipping ahead is not.
  return isCompletedOnboardingStep(user, pathname);
}

export function roleLandingPath(_role: UserRole | null) {
  return HOME_PATH;
}
