import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

type GroupContainerProps = {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  icon?: ReactNode;
  title?: string;
};

export function GroupContainer({
  action,
  children,
  className,
  contentClassName,
  icon,
  title,
}: GroupContainerProps) {
  return (
    <section className={cn('flex flex-col rounded-[12px] bg-bg-muted p-[4px]', className)}>
      {title || action ? (
        <div className="flex items-center justify-between gap-[8px] p-[6px]">
          {title ? (
            <div className="flex items-center gap-[8px]">
              {icon ? (
                <span className="inline-flex size-[20px] shrink-0 items-center justify-center text-fg-default [&_svg]:size-[20px]">
                  {icon}
                </span>
              ) : null}
              <Typography className="text-fg-default" fontWeight="medium" variant="body3">
                {title}
              </Typography>
            </div>
          ) : null}
          {action}
        </div>
      ) : null}
      <div
        className={cn(
          'overflow-hidden rounded-[8px] border border-subtle bg-bg-raised',
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
