import type { ProgressDirection, ProgressType } from './types';

export const DEFAULT_MIN = 0;

export const DEFAULT_MAX = 100;

export const CIRCLE_SIZE = 24;

export const CIRCLE_STROKE_WIDTH = 3;

export const rootTypeClass: Record<ProgressType, string> = {
  linear: 'flex w-full gap-[8px]',
  circular: 'flex w-full items-center gap-[8px]',
};

export const rootDirectionClass: Record<ProgressDirection, string> = {
  horizontal: 'items-center',
  vertical: 'flex-col items-stretch justify-center',
};

export const trackClass = 'relative h-[8px] min-w-px overflow-hidden rounded-full bg-bg-muted';

export const trackLinearClass: Record<ProgressDirection, string> = {
  horizontal: 'min-w-0 flex-1',
  vertical: 'w-full shrink-0',
};

export const barClass =
  'h-full rounded-[inherit] bg-bg-primary transition-[width] duration-[240ms]';

export const circleClass = 'relative size-[24px] shrink-0';
