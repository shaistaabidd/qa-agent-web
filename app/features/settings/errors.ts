import { toastUnhandledError } from '@/features/auth';
import { toast } from '@/shared/ui/toast';

import { TOAST_POSITION } from './constants';

/** Failures raised by our own code; the Apollo error link never sees these. */
export class SettingsActionError extends Error {}

export function reportSettingsError(error: unknown) {
  if (error instanceof SettingsActionError) {
    toast.error(error.message, { position: TOAST_POSITION });
    return;
  }

  toastUnhandledError(error);
}
