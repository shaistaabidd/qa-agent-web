import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';
import { lazy, Suspense } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Typography } from '@/shared/ui/Typography';
import { RouteLoadingScreen } from '@/shell/RouteLoadingScreen';

const NotFoundPage = lazy(() =>
  import('@/shell/not-found').then((module) => ({
    default: module.NotFoundPage,
  })),
);

type RootErrorBoundaryProps = {
  error?: unknown;
  fullPage?: boolean;
};

export function RootErrorBoundary({
  error: errorFromProps,
  fullPage = true,
}: RootErrorBoundaryProps) {
  const routeError = useRouteError();
  const error = errorFromProps ?? routeError;
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  if (isNotFound) {
    if (fullPage) {
      return (
        <Suspense fallback={<RouteLoadingScreen />}>
          <NotFoundPage />
        </Suspense>
      );
    }

    return <InlineNotFound />;
  }

  return <RootErrorFallback error={error} fullPage={fullPage} />;
}

function RootErrorFallback({ error, fullPage }: { error: unknown; fullPage: boolean }) {
  const devError = import.meta.env.DEV && error instanceof Error ? error : null;
  const subheading =
    isRouteErrorResponse(error) && error.statusText
      ? error.statusText
      : 'An unexpected error occurred. Please try again.';

  return (
    <main
      className={cn(
        'flex items-center justify-center bg-surface-background px-[24px] py-[40px]',
        fullPage ? 'min-h-dvh' : ['h-full min-h-0 flex-1 overflow-y-auto', scrollbarClass],
      )}
    >
      <div className="w-full max-w-[491px]">
        <EmptyState
          icon={<WarningCircleIcon aria-hidden className="size-full" weight="duotone" />}
          subheading={subheading}
          title="Something went wrong"
        >
          {devError ? <DevErrorDetails error={devError} /> : null}
          <div className="flex w-full flex-col gap-[12px] sm:flex-row sm:justify-center">
            <Button onClick={() => window.location.reload()} size="xl" type="button">
              Reload page
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link to="/">Go to home</Link>
            </Button>
          </div>
        </EmptyState>
      </div>
    </main>
  );
}

function InlineNotFound() {
  return (
    <main
      className={cn(
        'flex h-full min-h-0 flex-1 items-center justify-center overflow-y-auto bg-surface-background px-[24px] py-[40px]',
        scrollbarClass,
      )}
    >
      <div className="w-full max-w-[491px]">
        <EmptyState
          icon={<MagnifyingGlassIcon aria-hidden className="size-full" weight="duotone" />}
          subheading="The page you're looking for doesn't exist or may have moved."
          title="Page not found"
        >
          <Button asChild size="xl">
            <Link to="/">Go to home</Link>
          </Button>
        </EmptyState>
      </div>
    </main>
  );
}

function DevErrorDetails({ error }: { error: Error }) {
  return (
    <details className="w-full rounded-[12px] border border-low bg-surface-white p-[16px] text-left">
      <Typography as="summary" className="cursor-pointer text-medium" variant="body3">
        Error details
      </Typography>
      <pre
        className={cn(
          'mt-[12px] max-h-[240px] overflow-auto font-mono text-[12px] text-medium',
          scrollbarClass,
        )}
      >
        <code>{error.stack || error.message}</code>
      </pre>
    </details>
  );
}
