import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

type DetailRowProps = {
  children?: ReactNode;
  label: string;
  value?: string;
  valueClassName?: string;
};

export function DetailRow({ children, label, value, valueClassName }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-[4px] border-b border-subtle py-[12px] sm:flex-row sm:items-start sm:justify-between">
      <Typography className="text-fg-secondary" variant="body3">
        {label}
      </Typography>
      {children ?? (
        <Typography
          className={cn('sm:text-right', valueClassName ?? 'text-fg-default')}
          variant="body3"
        >
          {value}
        </Typography>
      )}
    </div>
  );
}
