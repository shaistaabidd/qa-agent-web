import type { CardMediaVariant } from './types';

export const cardClass = [
  'group/card relative flex flex-col overflow-hidden rounded-[16px] border border-subtle bg-bg-surface text-fg-default shadow-sm transition-colors',
  '[--card-spacing:16px] data-[size=sm]:[--card-spacing:12px] data-[size=lg]:[--card-spacing:24px]',
  'data-[variant=flat]:shadow-none',
  'data-[tone=danger]:border-danger',
  'data-[interactive]:cursor-pointer',
  'data-[interactive]:hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'data-[interactive]:active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  'data-[interactive]:focus-visible:border-focus data-[interactive]:focus-visible:shadow-focus data-[interactive]:outline-none',
].join(' ');

export const headerClass =
  'grid auto-rows-min items-start gap-[8px] px-[var(--card-spacing)] pt-[var(--card-spacing)] last:pb-[var(--card-spacing)] has-[[data-slot=card-action]]:grid-cols-[1fr_auto]';

export const headerTextClass = 'flex min-w-0 flex-col gap-[2px]';

export const actionClass = 'col-start-2 row-span-2 self-start justify-self-end';

export const contentClass =
  'flex flex-col gap-[16px] overflow-clip px-[var(--card-spacing)] py-[12px] group-has-[[data-slot=card-header]]/card:pt-[12px]';

export const footerClass =
  'flex items-center justify-end gap-[8px] overflow-clip border-t border-subtle px-[var(--card-spacing)] py-[12px]';

export const footerActionsClass = 'flex items-center gap-[8px]';

export const mediaClass: Record<CardMediaVariant, string> = {
  cover:
    'h-[160px] w-full shrink-0 overflow-clip [&_img]:block [&_img]:size-full [&_img]:object-cover',
  icon: 'col-span-full flex size-[32px] shrink-0 items-center justify-center overflow-clip text-icon-primary [&_svg]:size-[32px]',
};
