import type { ChipSize, ChipVariant } from './types';

export const baseClass = [
  'group/chip inline-flex shrink-0 items-center justify-center box-border gap-[4px]',
  'border border-solid rounded-full font-body text-fg-default',
  'appearance-none outline-none select-none',
  'transition-colors',
].join(' ');

export const sizeClass: Record<ChipSize, string> = {
  sm: 'h-[28px] px-[12px] text-label-sm',
  lg: 'h-[32px] px-[12px] text-label-base',
};

export const variantClass: Record<ChipVariant, string> = {
  default: 'border-strong bg-bg-raised shadow-sm',
  input: 'border-strong bg-bg-raised shadow-sm',
};

export const variantHoverClass: Record<ChipVariant, string> = {
  default:
    'border-strong bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  input:
    'border-strong bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
};

export const selectedClass = 'border-transparent bg-bg-primary-subtle text-fg-primary shadow-none';

export const liveClass: Record<ChipVariant, string> = {
  default: [
    'cursor-pointer hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
    'active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
    'data-[selected]:border-transparent data-[selected]:bg-bg-primary-subtle data-[selected]:text-fg-primary data-[selected]:shadow-none',
    'data-[selected]:hover:text-fg-default data-[selected]:active:text-fg-default',
    'focus-visible:border-focus focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-bg-muted disabled:text-fg-muted disabled:shadow-none',
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-transparent data-[disabled]:bg-bg-muted data-[disabled]:text-fg-muted data-[disabled]:shadow-none',
  ].join(' '),
  input: [
    'cursor-pointer hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
    'active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
    'data-[selected]:border-transparent data-[selected]:bg-bg-primary-subtle data-[selected]:text-fg-primary data-[selected]:shadow-none',
    'data-[selected]:hover:text-fg-default data-[selected]:active:text-fg-default',
    'focus-visible:border-focus focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-bg-muted disabled:text-fg-muted disabled:shadow-none',
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:border-transparent data-[disabled]:bg-bg-muted data-[disabled]:text-fg-muted data-[disabled]:shadow-none',
  ].join(' '),
};

export const previewClass = 'pointer-events-none';

export const labelClass = 'inline-flex items-center justify-center gap-[4px]';

export const iconSelectedClass = 'text-fg-default group-data-[selected]/chip:text-fg-primary';

export const iconDefaultClass = 'text-fg-default';

export const leftAdornmentClass: Record<ChipSize, string> = {
  sm: `flex size-[16px] shrink-0 items-center overflow-clip ${iconSelectedClass} [&_svg]:block [&_svg]:size-[16px] [&_svg]:shrink-0`,
  lg: `flex size-[20px] shrink-0 items-center overflow-clip ${iconSelectedClass} [&_svg]:block [&_svg]:size-[20px] [&_svg]:shrink-0`,
};

export const rightIconClass: Record<ChipSize, string> = {
  sm: `flex size-[14px] shrink-0 items-center overflow-clip ${iconDefaultClass} [&_svg]:block [&_svg]:size-[14px] [&_svg]:shrink-0`,
  lg: `flex size-[16px] shrink-0 items-center overflow-clip ${iconDefaultClass} [&_svg]:block [&_svg]:size-[16px] [&_svg]:shrink-0`,
};

export const removeClass = [
  'inline-flex shrink-0 cursor-pointer items-center justify-center',
  'ml-[2px] -mr-[4px] rounded-full border-0 bg-transparent p-0 appearance-none outline-none text-fg-secondary',
  'hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))] hover:text-fg-default',
  'active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  'focus-visible:shadow-focus',
].join(' ');

export const mainClass = [
  'inline-flex items-center justify-center border-0 bg-transparent p-0',
  'text-inherit appearance-none outline-none',
  'focus-visible:rounded-full focus-visible:shadow-focus',
].join(' ');
