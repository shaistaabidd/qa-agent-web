import type { CheckboxCheck, CheckboxInteraction } from './types';

export const rootClass = 'inline-flex items-start gap-[8px] data-[disabled]:cursor-not-allowed';

export const rootEmbeddedClass =
  'flex size-[20px] items-center justify-center overflow-hidden data-[disabled]:cursor-not-allowed';

export const textClass = 'flex min-w-0 flex-col items-start gap-[4px]';

export const controlWrapClass =
  'group/checkbox relative flex size-[20px] shrink-0 cursor-pointer leading-none has-[:disabled]:cursor-not-allowed';

export const inputClass = 'sr-only';

export const labelCursorClass = 'cursor-pointer';

export const labelDisabledCursorClass = 'cursor-not-allowed';

export const controlBaseClass = [
  'pointer-events-none box-border flex size-[20px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-solid leading-none text-fg-on-primary shadow-sm transition-colors [&_svg]:block',
  'border-strong bg-bg-raised',
  'data-[check=checked]:border-transparent data-[check=checked]:bg-bg-primary',
  'data-[check=indeterminate]:border-transparent data-[check=indeterminate]:bg-bg-primary',
].join(' ');

export const controlLiveClass = [
  'group-hover/checkbox:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'group-active/checkbox:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  'group-has-[:focus-visible]/checkbox:border-focus group-has-[:focus-visible]/checkbox:shadow-focus',
  'group-has-[:disabled]/checkbox:pointer-events-none group-has-[:disabled]/checkbox:shadow-none group-has-[:disabled]/checkbox:bg-[image:none]',
  'group-has-[:disabled]/checkbox:border-transparent group-has-[:disabled]/checkbox:bg-bg-muted group-has-[:disabled]/checkbox:text-fg-muted',
  'group-has-[[aria-invalid=true]]/checkbox:data-[check=off]:border-danger',
].join(' ');

export const controlClass = `${controlBaseClass} ${controlLiveClass}`;

export const controlEmbeddedClass = [
  controlBaseClass,
  'group-has-[:focus-visible]/checkbox:border-focus group-has-[:focus-visible]/checkbox:shadow-focus',
  'group-has-[:disabled]/checkbox:pointer-events-none group-has-[:disabled]/checkbox:shadow-none',
  'group-has-[:disabled]/checkbox:border-transparent group-has-[:disabled]/checkbox:bg-bg-muted group-has-[:disabled]/checkbox:text-fg-muted',
].join(' ');

export const previewInteractionClass: Record<
  Exclude<CheckboxInteraction, 'default'>,
  Record<CheckboxCheck, string>
> = {
  hover: {
    off: 'bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
    checked: 'bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
    indeterminate: 'bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  },
  pressed: {
    off: 'bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
    checked: 'bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
    indeterminate:
      'bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  },
};
