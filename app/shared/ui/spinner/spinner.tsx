import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';

import { cn } from '@/shared/lib/utils';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerTone = 'default' | 'primary' | 'inherit';

const SIZE_CLASS: Record<SpinnerSize, string> = {
  sm: 'size-[16px]',
  md: 'size-[20px]',
  lg: 'size-[24px]',
};

const TONE_CLASS: Record<SpinnerTone, string> = {
  default: 'text-fg-default',
  primary: 'text-fg-primary',
  inherit: 'text-inherit',
};

export function Spinner({
  'aria-label': ariaLabel = 'Loading',
  className,
  size = 'md',
  tone = 'inherit',
}: {
  'aria-label'?: string;
  className?: string;
  size?: SpinnerSize;
  tone?: SpinnerTone;
}) {
  return (
    <CircleNotchIcon
      aria-label={ariaLabel}
      className={cn('animate-spin', SIZE_CLASS[size], TONE_CLASS[tone], className)}
      role="status"
      weight="bold"
    />
  );
}
