import { useAuthStore } from '@/features/auth/model/authStore';
import {
  type AuthGraphQLUser,
  displayNameFromUser,
  normalizeUserType,
} from '@/features/auth/model/types';
import { clearOtpTimer } from '@/features/auth/otpTimer';
import {
  clearAuthFlowKeys,
  getPostLoginRedirect,
  persistGraphQLIdentity,
  setPostLoginRedirect,
} from '@/features/auth/utils/flowStorage';
import { getNextRequiredStep, pathAfterGraphQLAuth } from '@/features/auth/utils/nextStep';
import { safeRedirectPath } from '@/features/auth/utils/redirect';

export function mapGraphQLUser(user: AuthGraphQLUser): AuthGraphQLUser {
  return {
    ...user,
    userType: normalizeUserType(user.userType) ?? user.userType,
  };
}

export function applyGraphQLSession(token: string, rawUser: AuthGraphQLUser) {
  const previous = useAuthStore.getState().user;
  const mapped = mapGraphQLUser(rawUser);
  // Payloads like a settings name change don't select these; keep what this user already has.
  const user =
    previous?.id === mapped.id
      ? {
          ...mapped,
          featureFlags: mapped.featureFlags ?? previous.featureFlags,
          onboarding: mapped.onboarding ?? previous.onboarding,
        }
      : mapped;

  persistGraphQLIdentity(user);

  useAuthStore.getState().setSession({
    accessToken: token,
    user: {
      ...user,
      name: displayNameFromUser(user),
    },
  });

  return user;
}

export function pathAfterLogin(user: AuthGraphQLUser) {
  const requested = safeRedirectPath(getPostLoginRedirect());
  if (requested && !getNextRequiredStep(user)) {
    return requested;
  }

  return pathAfterGraphQLAuth(user);
}

export function hardNavigateAfterAuth(user: AuthGraphQLUser) {
  const destination = pathAfterLogin(user);
  setPostLoginRedirect(null);
  window.location.assign(destination);
}

/** Starts the session and leaves the auth flow, whether a code was verified or none was needed. */
export function finishSignIn(token: string, rawUser: AuthGraphQLUser) {
  // Set first so the bootstrap does not refetch the user the page reload is about to refetch.
  useAuthStore.setState({ signInRedirecting: true });
  const user = applyGraphQLSession(token, rawUser);
  clearAuthFlowKeys();
  clearOtpTimer();
  hardNavigateAfterAuth(user);
}
