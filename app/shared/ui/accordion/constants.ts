export const rootClass =
  'flex w-full flex-col overflow-hidden rounded-[8px] border border-solid border-subtle bg-bg-raised';

export const itemClass =
  'flex w-full min-w-0 flex-col not-last:border-b not-last:border-solid not-last:border-subtle';

export const headerClass = 'm-0 w-full';

export const triggerClass = [
  'flex w-full cursor-pointer appearance-none items-center gap-[8px] border-0 bg-transparent',
  'px-[16px] py-[16px] text-start outline-none select-none',
  'transition-colors hover:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'active:bg-[image:linear-gradient(var(--color-state-pressed),var(--color-state-pressed))]',
  'focus-visible:bg-[image:linear-gradient(var(--color-state-hover),var(--color-state-hover))]',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');

export const iconClass =
  'flex size-[20px] shrink-0 items-center justify-center text-fg-default [&_svg]:pointer-events-none [&_svg]:block [&_svg]:size-[20px] [&_svg]:shrink-0';

export const panelClass =
  'grid w-full transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none';

export const panelOpenClass = 'grid-rows-[1fr]';

export const panelClosedClass = 'grid-rows-[0fr]';

export const panelInnerClass = 'min-h-0 overflow-hidden';

export const contentClass =
  'flex flex-col gap-[8px] px-[16px] pb-[16px] font-body text-sm font-normal text-fg-default';
