import { useEffect, useRef } from 'react';

import { Spinner } from '@/shared/ui/spinner';
import { Typography } from '@/shared/ui/Typography';

import { useGoogleSignInMutation } from './hooks/useGoogleSignInMutation';

/** Where saas-api sends the browser back after Google, with a one-time code in the fragment. */
export function GoogleCallbackPage() {
  const { redeem } = useGoogleSignInMutation();
  const started = useRef(false);

  useEffect(() => {
    // The code and nonce are single-use, so a second effect run (Strict Mode) must not redeem again.
    if (started.current) return;
    started.current = true;
    void redeem();
  }, [redeem]);

  return (
    <div aria-live="polite" className="flex flex-col items-center gap-[16px] py-[32px]">
      <Spinner />
      <Typography variant="body2">Signing you in with Google…</Typography>
    </div>
  );
}
