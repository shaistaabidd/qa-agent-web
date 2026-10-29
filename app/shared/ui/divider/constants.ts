import type { DividerOrientation, DividerTone } from './types';

export const rootClass = 'flex shrink-0';

export const orientationClass: Record<DividerOrientation, string> = {
  horizontal: 'w-full items-center py-[8px]',
  vertical: 'self-stretch justify-center px-[12px]',
};

export const toneClass: Record<DividerTone, string> = {
  subtle: 'border-subtle',
  default: 'border-default',
};

export const lineOrientationClass: Record<DividerOrientation, string> = {
  horizontal: 'h-0 w-full border-t',
  vertical: 'h-full w-0 border-l',
};
