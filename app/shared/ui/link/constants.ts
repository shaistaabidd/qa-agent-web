import type { LinkTone } from './types';

export const baseClass =
  'rounded-[8px] underline decoration-1 underline-offset-2 outline-none cursor-pointer hover:text-fg-default active:text-fg-default focus-visible:shadow-focus aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:text-fg-muted';

export const toneClass: Record<LinkTone, string> = {
  primary: 'text-fg-primary',
  inherit: 'text-inherit',
};
