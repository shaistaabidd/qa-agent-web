import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Typography } from '@/shared/ui/Typography';

type SettingsRowProps = {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SettingsRow({ actions, children, className }: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[12px] border-b border-low px-[16px] py-[12px] last:border-b-0 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-[12px]">{children}</div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-[8px] self-end sm:self-auto">{actions}</div>
      ) : null}
    </div>
  );
}

type SettingsFieldProps = {
  label: string;
  value: string;
};

export function SettingsField({ label, value }: SettingsFieldProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center">
      <Typography className="text-medium" variant="body3">
        {label}
      </Typography>
      <Typography className="truncate text-high" fontWeight="medium" variant="body2">
        {value}
      </Typography>
    </div>
  );
}

type SettingsListItemProps = {
  actions: ReactNode;
  description: string;
  icon: ReactNode;
  title: string;
};

export function SettingsListItem({ actions, description, icon, title }: SettingsListItemProps) {
  return (
    <div className="flex flex-col gap-[12px] border-b border-low px-[4px] py-[2px] last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center">
        <div className="flex items-center justify-center pl-[12px] sm:pl-[16px]">
          <span className="inline-flex size-[24px] shrink-0 text-icon-high [&_svg]:size-[24px]">
            {icon}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center px-[12px] py-[10px]">
          <Typography className="text-high" fontWeight="medium" variant="body2">
            {title}
          </Typography>
          <Typography className="text-medium" variant="body3">
            {description}
          </Typography>
        </div>
      </div>
      <div className="flex shrink-0 items-center self-end pr-[12px] sm:self-auto sm:pr-[16px]">
        {actions}
      </div>
    </div>
  );
}

type SettingsSplitRowProps = {
  label: string;
  value: string;
};

export function SettingsSplitRow({ label, value }: SettingsSplitRowProps) {
  return (
    <div className="flex items-center justify-center gap-[16px] py-[8px]">
      <Typography className="min-w-0 flex-1 text-high" fontWeight="medium" variant="body2">
        {label}
      </Typography>
      <Typography className="min-w-0 flex-1 text-right text-medium" variant="body3">
        {value}
      </Typography>
    </div>
  );
}
