import type { LabelDirection } from './types';

export const stackClass = 'flex flex-col justify-center gap-[2px]';

export const horizontalClass = 'flex items-center justify-between gap-[8px]';

export const rowClass = 'flex items-center gap-[2px]';

export const hintIconClass =
  'inline-flex size-[16px] shrink-0 items-center justify-center text-fg-secondary [&_svg]:size-full';

export const directionClass: Record<LabelDirection, string> = {
  vertical: stackClass,
  horizontal: horizontalClass,
};
