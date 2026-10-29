import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

export function ComponentSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 space-y-8 border-b border-subtle py-12 first:pt-0 last:border-b-0"
    >
      <div className="space-y-1">
        <Typography as="h2" variant="h5">
          {title}
        </Typography>
        {description ? (
          <Typography variant="body3" className="text-fg-secondary">
            {description}
          </Typography>
        ) : null}
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

export function Example({
  title,
  description,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={cn('min-w-0 space-y-2.5', className)}>
      <div>
        <Typography variant="body3" fontWeight="medium">
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" className="text-fg-secondary">
            {description}
          </Typography>
        ) : null}
      </div>
      <div
        className={cn(
          'flex flex-wrap items-center gap-4 overflow-x-auto rounded-lg border border-subtle bg-bg-raised p-6',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ExampleGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2', className)}>{children}</div>;
}
