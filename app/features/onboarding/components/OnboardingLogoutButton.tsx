import { useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router';

import { logout, useAuthStore } from '@/features/auth';
import { Button } from '@/shared/ui/button';
import { LogoutConfirmDialog } from '@/shell/app/components/LogoutConfirmDialog';

const subscribeNoop = () => () => {};

export function OnboardingLogoutButton() {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);

  if (
    !mounted ||
    !isAuthenticated ||
    !(
      pathname.startsWith('/onboarding/') ||
      pathname === '/profile-setup' ||
      pathname === '/pricing' ||
      pathname === '/sign-document' ||
      pathname === '/add-calendar' ||
      pathname.startsWith('/payment-')
    )
  ) {
    return null;
  }

  return (
    <>
      <Button
        className="text-error no-underline hover:text-error active:text-error"
        onClick={() => setOpen(true)}
        size="md"
        type="button"
        variant="link"
      >
        Log out
      </Button>
      <LogoutConfirmDialog onConfirm={() => logout()} onOpenChange={setOpen} open={open} />
    </>
  );
}
