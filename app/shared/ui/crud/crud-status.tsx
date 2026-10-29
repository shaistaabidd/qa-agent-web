import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { TrayIcon } from '@phosphor-icons/react/Tray';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';
import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';

type CrudEmptyStateProps = {
  action?: ReactNode;
  searching?: boolean;
  subheading: string;
  title: string;
};

export function CrudEmptyState({
  action,
  searching = false,
  subheading,
  title,
}: CrudEmptyStateProps) {
  const Icon = searching ? MagnifyingGlassIcon : TrayIcon;

  return (
    <EmptyState
      className="py-[16px]"
      icon={<Icon aria-hidden weight="regular" />}
      size="md"
      subheading={subheading}
      title={title}
    >
      {action}
    </EmptyState>
  );
}

type CrudErrorStateProps = {
  message: string;
  onRetry: () => void;
  title: string;
};

export function CrudErrorState({ message, onRetry, title }: CrudErrorStateProps) {
  return (
    <div className="px-[24px] py-[40px]" role="status">
      <EmptyState
        icon={<WarningCircleIcon aria-hidden weight="regular" />}
        size="md"
        subheading={message}
        title={title}
      >
        <Button onClick={onRetry} size="md" type="button">
          Try again
        </Button>
      </EmptyState>
    </div>
  );
}
