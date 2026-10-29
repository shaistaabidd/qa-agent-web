import { cn } from '@/shared/lib/utils';

import type { StatProps } from './types';

export function Stat({ className, foot, label, value, ...props }: StatProps) {
  return (
    <div {...props} className={cn('flex min-w-0 flex-col gap-[4px]', className)} data-slot="stat">
      <span className="text-body-sm text-fg-secondary" data-slot="stat-label">
        {label}
      </span>
      <span
        className="text-display text-fg-default [font-variant-numeric:tabular-nums]"
        data-slot="stat-value"
      >
        {value}
      </span>
      {foot ? (
        <div
          className="flex items-center gap-[8px] text-body-sm text-fg-secondary"
          data-slot="stat-foot"
        >
          {foot}
        </div>
      ) : null}
    </div>
  );
}
