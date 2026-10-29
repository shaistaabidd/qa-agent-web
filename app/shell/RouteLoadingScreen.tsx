import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';

import { cn } from '@/shared/lib/utils';
import { BrandLogo } from '@/shared/ui/brand-logo';

type RouteLoadingScreenProps = {
  showLogo?: boolean;
};

export function RouteLoadingScreen({ showLogo = true }: RouteLoadingScreenProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'flex w-full animate-in flex-col items-center justify-center gap-[16px] bg-surface-background fade-in duration-200',
        showLogo ? 'h-dvh' : 'h-full min-h-0 flex-1',
      )}
    >
      {showLogo ? <BrandLogo className="text-[20px]" /> : null}
      <CircleNotchIcon
        aria-hidden
        className="size-[28px] animate-spin text-icon-primary"
        weight="regular"
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}
