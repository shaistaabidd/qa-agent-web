import { useSyncExternalStore } from 'react';

import { isImpersonating, stopImpersonating, useAuthStore } from '@/features/auth';
import { Banner } from '@/shared/ui/banner';

// Impersonation starts and stops with a full page reload, so the value never changes in place.
function subscribe() {
  return () => {};
}

export function ImpersonationBanner() {
  // Secure storage only exists in the browser. The server renders the banner hidden.
  const active = useSyncExternalStore(subscribe, isImpersonating, () => false);
  const name = useAuthStore((state) => state.user?.name ?? state.user?.email);

  if (!active) {
    return null;
  }

  return (
    <Banner
      action="Back to Admin"
      className="rounded-none"
      onAction={stopImpersonating}
      title={`You are impersonating ${name ?? 'another user'}.`}
      variant="warning"
    />
  );
}
