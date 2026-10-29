import { Link } from 'react-router';

import { OnboardingLogoutButton } from '@/features/onboarding';
import { scrollbarHiddenClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { BrandLogo } from '@/shared/ui/brand-logo';

import type { AuthFrameProps } from './types';

const AUTH_LOGO_CLASS = 'inline-flex text-[20px]';

function AuthLogo({ linked }: { linked: boolean }) {
  const image = <BrandLogo />;

  if (!linked) {
    return <span className={AUTH_LOGO_CLASS}>{image}</span>;
  }

  return (
    <Link className={AUTH_LOGO_CLASS} to="/">
      {image}
    </Link>
  );
}

export function AuthFrame({ children, className, linkLogo = true }: AuthFrameProps) {
  return (
    <div
      className={cn(
        'flex h-dvh animate-in overflow-hidden bg-surface-background fade-in duration-200',
        className,
      )}
    >
      <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between gap-[12px] px-[24px] pt-[24px] md:px-[32px] md:pt-[32px] xl:px-[50px] xl:pt-[50px]">
          <AuthLogo linked={linkLogo} />
          <OnboardingLogoutButton />
        </div>
        <main className={cn('min-h-0 flex-1 overflow-y-auto', scrollbarHiddenClass)}>
          <div
            className={cn(
              'flex min-h-full w-full items-center justify-center',
              'px-[24px] py-[40px] md:px-[32px] md:py-[40px] xl:px-[50px] xl:py-[48px]',
            )}
          >
            <div className="flex w-full max-w-[491px] flex-col items-stretch gap-[24px] xl:gap-[32px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
