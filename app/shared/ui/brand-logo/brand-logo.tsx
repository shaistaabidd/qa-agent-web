import { CubeIcon } from '@phosphor-icons/react/Cube';

import { cn } from '@/shared/lib/utils';

export const APP_NAME = 'SaaS Temp';

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-[8px] text-high', className)}>
      <CubeIcon aria-hidden className="size-[1.5em] shrink-0 text-icon-primary" weight="fill" />
      <span className="font-heading text-[1.125em] font-semibold leading-none">{APP_NAME}</span>
    </span>
  );
}
