import { BellIcon } from '@phosphor-icons/react/Bell';
import { CheckCircleIcon } from '@phosphor-icons/react/CheckCircle';
import { InfoIcon } from '@phosphor-icons/react/Info';
import { WarningIcon } from '@phosphor-icons/react/Warning';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';

import type { AlertVariant } from './types';
import { getIconWrapClassName } from './utils';

const ICONS = {
  error: WarningCircleIcon,
  info: InfoIcon,
  neutral: BellIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
} as const;

export function AlertIcon({ variant }: { variant: AlertVariant }) {
  const Icon = ICONS[variant];

  return (
    <span className={getIconWrapClassName(variant)} data-slot="alert-icon">
      <Icon aria-hidden className="size-[20px]" weight="fill" />
    </span>
  );
}
