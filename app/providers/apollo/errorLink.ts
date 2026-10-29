import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { ErrorLink } from '@apollo/client/link/error';

import { logout, useAuthStore } from '@/features/auth';
import { toast } from '@/shared/ui/toast';

const ACCESS_REVOKED_MESSAGES = [
  'Your account access is revoked. Please contact admin',
  'Account access has been revoked. Please contact admin to get it enabled!',
] as const;

const SESSION_EXPIRED_MESSAGES = [
  'Your session has expired or you are not authenticated. Please log in to continue.',
  'Unauthorized error',
] as const;

const PRE_AUTH_OPERATIONS = new Set([
  'RegisterUser',
  'LoginUser',
  'ValidateOtp',
  'SignInWithGoogle',
  'ResendOtp',
  'SendResetPasswordInstructions',
  'SetPassword',
  'AcceptInvitation',
]);
const LOGOUT_OPERATION = 'Logout';

const SESSION_EXPIRED_CODES = ['UNAUTHENTICATED', 'UNAUTHORIZED'];
const ACCESS_REVOKED_CODES = ['ACCESS_REVOKED'];

/** Operations with `context: { silentErrors: true }` skip toasts but still end an expired session. */

let sessionEnding = false;

function includesAny(message: string, needles: readonly string[]) {
  return needles.some((needle) => message.includes(needle));
}

const FRIENDLY_MESSAGES: readonly [RegExp, string][] = [
  [/^invalid credentials\.?$/i, 'Invalid email or password.'],
  [
    /^unable to find user associated with email\.?$/i,
    'We could not find an account with that email address.',
  ],
];

const GENERIC_ERROR = 'Something went wrong on our side. Please try again.';

/** Never shows Apollo's raw transport text (e.g. "Received status code 500") to users. */
function transportErrorMessage(error: unknown) {
  if (ServerError.is(error)) {
    if (error.statusCode === 413) return 'That file is too large. Please choose a smaller one.';
    if (error.statusCode === 429) return 'Too many attempts. Please wait a moment and try again.';
    if (error.statusCode === 401) return 'Your session has expired. Please log in to continue.';
    return GENERIC_ERROR;
  }

  return 'We could not reach the server. Check your connection and try again.';
}

function friendlyMessage(message: string) {
  return FRIENDLY_MESSAGES.find(([pattern]) => pattern.test(message.trim()))?.[1] ?? message;
}

function hasCode(error: { extensions?: Record<string, unknown> }, codes: readonly string[]) {
  const code = error.extensions?.code;
  return typeof code === 'string' && codes.includes(code);
}

function endSession(message?: string, silent = false) {
  if (sessionEnding) {
    return;
  }

  sessionEnding = true;
  if (message && !silent) {
    toast.error(message);
  }
  if (!logout(message)) {
    sessionEnding = false;
  }
}

export function createErrorLink() {
  return new ErrorLink(({ error, operation }) => {
    const silent = Boolean(operation.getContext().silentErrors);
    if (sessionEnding) {
      return;
    }

    const operationName = operation.operationName ?? '';
    const isLogout = operationName === LOGOUT_OPERATION;
    const handlesSession =
      !isLogout &&
      !PRE_AUTH_OPERATIONS.has(operationName) &&
      Boolean(useAuthStore.getState().accessToken);

    if (ServerError.is(error) && error.statusCode === 401) {
      if (!handlesSession) {
        if (!isLogout && !silent) {
          toast.error(transportErrorMessage(error));
        }
        return;
      }
      endSession('Your session has expired. Please log in to continue.', silent);
      return;
    }

    if (CombinedGraphQLErrors.is(error)) {
      const errors = error.errors;
      const messages = errors.map((item) => item.message);

      if (
        errors.some((item) => hasCode(item, ACCESS_REVOKED_CODES)) ||
        messages.some((message) => includesAny(message, ACCESS_REVOKED_MESSAGES))
      ) {
        if (handlesSession) {
          endSession(undefined, silent);
          return;
        }
      }

      const expiredIndex = errors.findIndex(
        (item) =>
          hasCode(item, SESSION_EXPIRED_CODES) ||
          includesAny(item.message, SESSION_EXPIRED_MESSAGES),
      );
      if (expiredIndex >= 0) {
        if (handlesSession) {
          endSession(messages[expiredIndex], silent);
          return;
        }
        if (isLogout) {
          return;
        }
      }

      const first = messages[0];
      if (first && !silent) {
        toast.error(friendlyMessage(first));
      }
      return;
    }

    if (!silent) {
      toast.error(transportErrorMessage(error));
    }
  });
}
