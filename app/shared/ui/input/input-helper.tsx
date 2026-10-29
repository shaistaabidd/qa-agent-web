import { InfoIcon } from '@phosphor-icons/react/Info';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

import { helperClass, helperIconClass } from './constants';

export function InputHelper({
  children,
  icon,
  id,
  invalid = false,
}: {
  children: ReactNode;
  icon?: ReactNode | null;
  id: string;
  invalid?: boolean;
}) {
  const resolvedIcon = icon === undefined ? <InfoIcon weight="fill" /> : icon;

  return (
    <p
      id={id}
      data-slot="input-helper"
      className={cn(helperClass, invalid ? 'text-fg-danger' : 'text-fg-secondary')}
    >
      {resolvedIcon ? <span className={helperIconClass}>{resolvedIcon}</span> : null}
      <Typography as="span" variant="caption">
        {children}
      </Typography>
    </p>
  );
}
