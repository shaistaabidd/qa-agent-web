import type { RadioCheck, RadioInteraction } from './types';

export const rootClass =
  'group/radio inline-flex cursor-pointer items-start gap-[8px] data-[disabled]:cursor-not-allowed';

export const textClass = 'flex min-w-0 flex-col items-start gap-[4px]';

export const controlWrapClass =
  'relative inline-flex size-[20px] shrink-0 cursor-pointer has-[:disabled]:cursor-not-allowed';

export const inputClass = 'sr-only';

export const labelCursorClass = 'cursor-pointer';

export const labelDisabledCursorClass = 'cursor-not-allowed';

export const groupClass = 'flex flex-col items-start gap-[8px]';

export const controlBaseClass = [
  'pointer-events-none relative box-border inline-grid size-[20px] shrink-0 place-items-center rounded-full border border-solid text-fg-on-primary shadow-sm transition-colors',
  "after:size-[8px] after:rounded-full after:bg-current after:opacity-0 after:transition-opacity after:content-['']",
  'border-strong bg-bg-raised',
].join(' ');

export const previewCheckedClass =
  'data-[check=on]:border-transparent data-[check=on]:bg-bg-primary data-[check=on]:after:opacity-100';

export const controlLiveClass = [
  'group-has-[input:checked]/radio:border-transparent group-has-[input:checked]/radio:bg-bg-primary group-has-[input:checked]/radio:after:opacity-100',
  'data-[check=on]:border-transparent data-[check=on]:bg-bg-primary data-[check=on]:after:opacity-100',
  'group-hover/radio:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'group-active/radio:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  'group-has-[:focus-visible]/radio:border-focus group-has-[:focus-visible]/radio:shadow-focus',
  'group-has-[input:disabled]/radio:pointer-events-none group-has-[input:disabled]/radio:shadow-none group-has-[input:disabled]/radio:bg-[image:none]',
  'group-has-[input:disabled]/radio:border-transparent group-has-[input:disabled]/radio:bg-bg-muted group-has-[input:disabled]/radio:text-fg-muted',
  'group-has-[input[data-invalid]:not(:checked)]/radio:border-danger',
].join(' ');

export const controlClass = `${controlBaseClass} ${controlLiveClass}`;

export const controlEmbeddedClass = [
  controlBaseClass,
  previewCheckedClass,
  'group-has-[input:checked]/radio:border-transparent group-has-[input:checked]/radio:bg-bg-primary group-has-[input:checked]/radio:after:opacity-100',
  'group-has-[input:disabled]/radio:pointer-events-none group-has-[input:disabled]/radio:shadow-none',
  'group-has-[input:disabled]/radio:border-transparent group-has-[input:disabled]/radio:bg-bg-muted group-has-[input:disabled]/radio:text-fg-muted',
].join(' ');

export const previewInteractionClass: Record<
  Exclude<RadioInteraction, 'default'>,
  Record<RadioCheck, string>
> = {
  hover: {
    off: 'bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
    on: 'data-[check=on]:border-transparent data-[check=on]:bg-bg-primary data-[check=on]:after:opacity-100 bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  },
  pressed: {
    off: 'bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
    on: 'data-[check=on]:border-transparent data-[check=on]:bg-bg-primary data-[check=on]:after:opacity-100 bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  },
};
