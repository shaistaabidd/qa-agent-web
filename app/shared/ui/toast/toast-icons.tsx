import { CheckIcon } from '@phosphor-icons/react/Check';
import { InfoIcon } from '@phosphor-icons/react/Info';
import { XIcon } from '@phosphor-icons/react/X';

import { iconWrapClass } from './constants';
import type { ToastStatusVariant } from './types';

const ICONS = {
  error: XIcon,
  info: InfoIcon,
  success: CheckIcon,
} as const;

const ICON_CLASS: Record<ToastStatusVariant, string> = {
  error: 'size-[20px] text-fg-danger',
  info: 'size-[20px] text-fg-info',
  success: 'size-[20px] text-fg-success',
};

export function ToastIcon({ variant }: { variant: ToastStatusVariant }) {
  const Icon = ICONS[variant];

  return (
    <span className={iconWrapClass[variant]} data-slot="toast-icon">
      <Icon aria-hidden className={ICON_CLASS[variant]} weight="bold" />
    </span>
  );
}

export function ToastCloseIcon() {
  return <XIcon aria-hidden className="size-[16px] text-fg-secondary" weight="regular" />;
}
