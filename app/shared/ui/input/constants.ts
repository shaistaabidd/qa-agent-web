import type { InputAdornmentAlign, InputSize } from './types';

export const fieldClass = 'flex w-full flex-col gap-[8px]';

export const containerClass = [
  'group/input relative box-border flex w-full min-w-0 cursor-text items-center overflow-hidden rounded-[12px] border border-default bg-bg-raised shadow-sm outline-none transition-colors',
  // Hover just steps the edge to the stronger border -- no overlay or halo.
  'hover:border-strong',
  'focus-within:border-focus focus-within:shadow-focus',
  'focus-within:hover:border-focus',
  'has-[input[readonly]]:border-subtle has-[input[readonly]]:bg-transparent has-[input[readonly]]:shadow-none',
  'has-[:disabled]:pointer-events-none has-[:disabled]:cursor-not-allowed has-[:disabled]:border-subtle has-[:disabled]:bg-bg-muted has-[:disabled]:shadow-none',
  'data-[invalid]:border-danger data-[invalid]:hover:border-danger',
  'data-[invalid]:focus-within:border-danger data-[invalid]:focus-within:hover:border-danger data-[invalid]:focus-within:shadow-focus-danger',
].join(' ');

export const containerSizeClass: Record<InputSize, string> = {
  sm: 'h-[32px]',
  md: 'h-[40px]',
  lg: 'h-[48px]',
  xl: 'h-[56px]',
};

export const controlClass =
  'h-auto w-full min-w-0 flex-1 appearance-none rounded-[inherit] border-0 bg-transparent font-body font-regular text-fg-default shadow-none outline-none placeholder:text-fg-secondary disabled:cursor-not-allowed disabled:text-fg-muted';

export const controlSizeClass: Record<InputSize, string> = {
  sm: 'px-[12px] text-body-base',
  md: 'px-[12px] text-body-base',
  lg: 'px-[16px] text-body-lg',
  xl: 'px-[16px] text-body-lg',
};

export const adornmentClass =
  'flex shrink-0 items-center justify-center self-stretch text-fg-secondary [&_svg]:pointer-events-none [&_svg]:shrink-0 group-has-[:disabled]/input:text-fg-muted';

export const adornmentSizeClass: Record<InputSize, string> = {
  sm: '[&_svg]:size-[16px]',
  md: '[&_svg]:size-[20px]',
  lg: '[&_svg]:size-[20px]',
  xl: '[&_svg]:size-[20px]',
};

export const adornmentAlignClass: Record<InputAdornmentAlign, Record<InputSize, string>> = {
  start: {
    sm: 'pl-[12px]',
    md: 'pl-[12px]',
    lg: 'pl-[16px]',
    xl: 'pl-[16px]',
  },
  end: {
    sm: 'pr-[12px]',
    md: 'pr-[12px]',
    lg: 'pr-[16px]',
    xl: 'pr-[16px]',
  },
};

export const helperClass = 'flex items-center gap-[2px]';

export const helperIconClass =
  'inline-flex size-[16px] shrink-0 items-center justify-center [&_svg]:size-full';
