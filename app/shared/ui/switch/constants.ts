import type { SwitchCheck, SwitchInteraction } from './types';

export const rootClass = 'inline-flex items-start gap-[8px] data-[disabled]:cursor-not-allowed';

export const textClass = 'flex min-w-0 flex-col items-start gap-[4px]';

export const controlWrapClass =
  'group/switch relative inline-flex h-[24px] w-[40px] shrink-0 cursor-pointer has-[:disabled]:cursor-not-allowed';

export const inputClass = 'sr-only';

export const embeddedInputClass =
  'absolute inset-0 z-10 m-0 cursor-pointer appearance-none opacity-0';

export const labelCursorClass = 'cursor-pointer';

export const labelDisabledCursorClass = 'cursor-not-allowed';

export const thumbClass = [
  'pointer-events-none absolute top-[2px] left-[2px] size-[20px] rounded-full bg-fg-on-primary shadow-sm transition-transform',
  'data-[check=on]:translate-x-[16px]',
  'group-has-[:disabled]/switch:bg-fg-muted group-has-[:disabled]/switch:shadow-none',
].join(' ');

export const controlBaseClass = [
  'pointer-events-none relative box-border block h-[24px] w-[40px] flex-none rounded-full transition-colors',
  'bg-bg-muted shadow-[inset_0_0_0_1px_var(--border-color-strong)]',
  'data-[check=on]:bg-bg-primary data-[check=on]:shadow-none',
].join(' ');

export const controlLiveClass = [
  'group-hover/switch:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'group-active/switch:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  'group-has-[:focus-visible]/switch:shadow-[inset_0_0_0_1px_var(--border-color-focus),0_0_0_4px_var(--color-state-focus)]',
  'group-has-[:focus-visible]/switch:data-[check=on]:shadow-[inset_0_0_0_1px_var(--border-color-focus),0_0_0_4px_var(--color-state-focus)]',
  'group-has-[:disabled]/switch:pointer-events-none group-has-[:disabled]/switch:bg-[image:none]',
  'group-has-[:disabled]/switch:bg-bg-muted group-has-[:disabled]/switch:shadow-[inset_0_0_0_1px_var(--border-color-subtle)]',
  'group-has-[:disabled]/switch:data-[check=on]:bg-bg-muted group-has-[:disabled]/switch:data-[check=on]:shadow-[inset_0_0_0_1px_var(--border-color-subtle)]',
].join(' ');

export const controlClass = `${controlBaseClass} ${controlLiveClass}`;

export const controlEmbeddedClass = [
  controlBaseClass,
  'group-has-[:disabled]/switch:pointer-events-none',
  'group-has-[:disabled]/switch:bg-bg-muted group-has-[:disabled]/switch:shadow-[inset_0_0_0_1px_var(--border-color-subtle)]',
  'group-has-[:disabled]/switch:data-[check=on]:bg-bg-muted group-has-[:disabled]/switch:data-[check=on]:shadow-[inset_0_0_0_1px_var(--border-color-subtle)]',
].join(' ');

export const previewDisabledClass =
  'data-[disabled]:bg-bg-muted data-[disabled]:shadow-[inset_0_0_0_1px_var(--border-color-subtle)] data-[disabled]:data-[check=on]:bg-bg-muted data-[disabled]:data-[check=on]:shadow-[inset_0_0_0_1px_var(--border-color-subtle)]';

export const previewInteractionClass: Record<
  Exclude<SwitchInteraction, 'default'>,
  Record<SwitchCheck, string>
> = {
  hover: {
    off: 'bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
    on: 'data-[check=on]:bg-bg-primary data-[check=on]:shadow-none bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  },
  pressed: {
    off: 'bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
    on: 'data-[check=on]:bg-bg-primary data-[check=on]:shadow-none bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  },
};

export const previewDisabledInteractionClass: Record<
  Exclude<SwitchInteraction, 'pressed'>,
  string
> = {
  default: previewDisabledClass,
  hover: previewDisabledClass,
};
