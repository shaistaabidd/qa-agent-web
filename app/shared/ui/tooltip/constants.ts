import type { TooltipSide } from './types';

export const DEFAULT_DELAY_DURATION = 200;
export const CLOSE_DELAY_DURATION = 100;
export const DEFAULT_SIDE_OFFSET = 4;
export const VIEWPORT_PADDING = 8;
export const TOOLTIP_MAX_WIDTH = 240;

export const contentClass =
  'pointer-events-auto z-(--z-tooltip) flex w-fit max-w-[240px] items-center overflow-visible';

export const contentOrientationClass: Record<TooltipSide, string> = {
  bottom: 'flex-col',
  left: 'flex-row',
  right: 'flex-row',
  top: 'flex-col',
};

export const bodyClass =
  'max-w-[240px] rounded-[8px] bg-bg-inverse px-[8px] py-[4px] text-label-sm text-fg-inverse';

export const arrowClass: Record<TooltipSide, string> = {
  bottom:
    'mb-[-1px] block h-[7px] w-[12px] shrink-0 bg-bg-inverse [clip-path:polygon(50%_0%,0_100%,100%_100%)]',
  left: 'ml-[-1px] block h-[12px] w-[7px] shrink-0 bg-bg-inverse [clip-path:polygon(0_0,0_100%,100%_50%)]',
  right:
    'mr-[-1px] block h-[12px] w-[7px] shrink-0 bg-bg-inverse [clip-path:polygon(100%_0,0_50%,100%_100%)]',
  top: 'mt-[-1px] block h-[7px] w-[12px] shrink-0 bg-bg-inverse [clip-path:polygon(0_0,100%_0,50%_100%)]',
};
