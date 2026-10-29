import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

import type { PageHeaderProps, PageProps, SettingProps, ToolbarProps } from './types';

export function Page({ children, className, ...props }: PageProps) {
  return (
    <div
      {...props}
      className={cn(
        'mx-auto flex w-full max-w-[1200px] flex-col gap-[24px] p-[16px] lg:p-[24px]',
        className,
      )}
      data-slot="page"
    >
      {children}
    </div>
  );
}

export function PageHeader({ actions, children, className, ...props }: PageHeaderProps) {
  return (
    <div
      {...props}
      className={cn('flex flex-wrap items-start justify-between gap-[16px]', className)}
      data-slot="page-header"
    >
      <div className="flex min-w-0 flex-col">{children}</div>
      {actions ? <div className="flex flex-wrap items-center gap-[8px]">{actions}</div> : null}
    </div>
  );
}

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <Typography as="h1" className="text-fg-default" fontWeight="semibold" variant="h6">
      {children}
    </Typography>
  );
}

export function PageDescription({ children }: { children: ReactNode }) {
  return (
    <Typography className="text-fg-secondary" variant="body3">
      {children}
    </Typography>
  );
}

export function Toolbar({ children, className, ...props }: ToolbarProps) {
  return (
    <div
      {...props}
      className={cn('flex flex-wrap items-center gap-[8px]', className)}
      data-slot="toolbar"
    >
      {children}
    </div>
  );
}

export function ToolbarGrow({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('min-w-0 flex-1', className)} data-slot="toolbar-grow">
      {children}
    </div>
  );
}

export function Setting({
  children,
  className,
  control,
  description,
  title,
  ...props
}: SettingProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-wrap items-start justify-between gap-[16px] border-b border-subtle py-[16px] first:pt-0 last:border-b-0 last:pb-0',
        className,
      )}
      data-slot="setting"
    >
      <div className="min-w-[192px] flex-1">
        <Typography as="p" className="text-fg-default" fontWeight="medium" variant="body3">
          {title}
        </Typography>
        {description ? (
          <Typography as="p" className="text-fg-secondary" variant="caption">
            {description}
          </Typography>
        ) : null}
        {children}
      </div>
      {control ? <div className="flex shrink-0 items-center">{control}</div> : null}
    </div>
  );
}
