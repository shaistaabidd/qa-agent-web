import { GoogleLogoIcon } from '@phosphor-icons/react/GoogleLogo';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Divider } from '@/shared/ui/divider';
import { toast } from '@/shared/ui/toast';
import { Typography } from '@/shared/ui/Typography';

import { startGoogleSignIn } from './utils/googleSignIn';

/** "or" divider and the Google button, shown on log in and sign up while Google sign-in is on. */
export function GoogleSignInButton() {
  const [redirecting, setRedirecting] = useState(false);

  // Coming Back from Google can restore this page from the back/forward cache with the button
  // still disabled.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setRedirecting(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  function start() {
    setRedirecting(true);
    try {
      startGoogleSignIn();
    } catch {
      setRedirecting(false);
      toast.error("We couldn't start Google sign-in. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <Divider className="flex-1" />
        <Typography className="text-disabled" variant="body2">
          or
        </Typography>
        <Divider className="flex-1" />
      </div>
      <Button
        aria-busy={redirecting}
        className="w-full"
        disabled={redirecting}
        leftIcon={<GoogleLogoIcon aria-hidden weight="bold" />}
        onClick={start}
        type="button"
        variant="outline"
      >
        Continue with Google
      </Button>
    </div>
  );
}
