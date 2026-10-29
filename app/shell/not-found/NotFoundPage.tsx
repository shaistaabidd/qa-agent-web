import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { Link, Navigate } from 'react-router';

import { getNextRequiredStep, LOGIN_PATH, useAuthStore } from '@/features/auth';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { AppChrome } from '@/shell/app/AppChrome';

const NOT_FOUND_COPY = "The page you're looking for doesn't exist or may have moved.";

export function NotFoundPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-background p-[16px]">
        <EmptyState
          icon={<MagnifyingGlassIcon aria-hidden weight="regular" />}
          subheading={NOT_FOUND_COPY}
          title="Page not found"
        >
          <Button asChild>
            <Link to={LOGIN_PATH}>Back to login</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const nextStep = user ? getNextRequiredStep(user) : null;
  if (nextStep) {
    return <Navigate replace to={nextStep} />;
  }

  return (
    <AppChrome>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-[16px] md:p-[24px]">
        <EmptyState
          icon={<MagnifyingGlassIcon aria-hidden weight="regular" />}
          subheading={NOT_FOUND_COPY}
          title="Page not found"
        >
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </EmptyState>
      </div>
    </AppChrome>
  );
}
