import type { SliderInteraction } from './types';

export const DEFAULT_MIN = 0;

export const DEFAULT_MAX = 100;

export const DEFAULT_STEP = 1;

export const rootClass =
  'relative flex w-full min-w-0 cursor-pointer touch-none select-none items-center py-[8px] data-[disabled]:cursor-not-allowed';

export const barClass = 'relative h-[4px] w-full rounded-full bg-border-subtle';

export const trackClass = 'absolute h-full rounded-full bg-bg-primary';

export const handleHitClass = [
  'group/thumb absolute top-1/2 flex size-[16px] -translate-x-1/2 -translate-y-1/2',
  'appearance-none cursor-pointer border-0 bg-transparent p-0',
  'focus-visible:outline-none',
].join(' ');

export const handleShapeClass =
  'box-border size-[16px] shrink-0 rounded-full border border-solid border-subtle bg-bg-raised';

export const handlePositionClass = 'absolute top-1/2 -translate-x-1/2 -translate-y-1/2';

export const handleLiveClass = [
  'hover:border-focus',
  'active:border-focus active:shadow-focus',
  'group-focus-visible/thumb:border-focus group-focus-visible/thumb:shadow-focus',
  'group-data-[pressed]/thumb:border-focus group-data-[pressed]/thumb:shadow-focus',
].join(' ');

export const handleDisabledClass = 'cursor-not-allowed border-subtle shadow-none';

export const previewInteractionClass: Record<Exclude<SliderInteraction, 'default'>, string> = {
  hover: 'border-focus',
  pressed: 'border-focus shadow-focus',
};

export const inputClass = 'hidden';
