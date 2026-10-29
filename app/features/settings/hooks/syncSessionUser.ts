import { applyGraphQLSession, type AuthGraphQLUser, useAuthStore } from '@/features/auth';
import { toast } from '@/shared/ui/toast';

import { TOAST_POSITION } from '../constants';

export function showSuccess(message: string) {
  toast.success(message, { position: TOAST_POSITION });
}

/** Keeps the sidebar and other session readers in step with the saved user. */
export function syncSessionUser(user?: AuthGraphQLUser | null) {
  const token = useAuthStore.getState().accessToken;

  if (user && token) {
    applyGraphQLSession(token, user);
  }
}
