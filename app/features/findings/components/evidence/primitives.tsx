import type { ReactNode } from 'react';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

export function EvidenceSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="flex flex-col gap-[8px]">
      <Typography as="h3" fontWeight="semibold" variant="body2">
        {title}
      </Typography>
      {children}
    </section>
  );
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre
      className={cn(
        'max-h-[320px] overflow-auto rounded-[8px] border border-low bg-surface-background-variant p-[12px] font-mono text-[12px] whitespace-pre-wrap text-fg-default',
        scrollbarClass,
      )}
    >
      {children}
    </pre>
  );
}

type Fact = [label: string, value: ReactNode];

/** Label and value pairs on one wrapping line. Pairs with no value are left out. */
export function Facts({ items }: { items: Fact[] }) {
  const present = items.filter(([, value]) => value != null && value !== '');

  return (
    <dl className="flex flex-wrap gap-x-[24px] gap-y-[4px]">
      {present.map(([label, value]) => (
        <div className="flex gap-[6px]" key={label}>
          <dt className="text-fg-secondary">{label}</dt>
          <dd className="font-medium text-fg-default">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
