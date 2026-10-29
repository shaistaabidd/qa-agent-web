import { CheckCircleIcon } from '@phosphor-icons/react/CheckCircle';
import { InfoIcon } from '@phosphor-icons/react/Info';
import { WarningIcon } from '@phosphor-icons/react/Warning';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';

import type { BannerVariant } from './types';
import { getIconWrapClassName } from './utils';

const ICONS = {
  error: WarningCircleIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
} as const;

export function BannerIcon({ variant }: { variant: BannerVariant }) {
  const Icon = ICONS[variant];

  return (
    <span className={getIconWrapClassName(variant)} data-slot="banner-icon">
      <Icon aria-hidden className="size-[20px]" weight="fill" />
    </span>
  );
}
