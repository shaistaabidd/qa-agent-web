export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const DAYS_IN_WEEK = 7;

export const CALENDAR_WEEKS = 6;

export const CALENDAR_CELLS = DAYS_IN_WEEK * CALENDAR_WEEKS;

export const ARROW_DAY_STEP = {
  ArrowDown: DAYS_IN_WEEK,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -DAYS_IN_WEEK,
} as const;

export const rootSingleClass = [
  'flex w-full max-w-[400px] flex-col overflow-hidden rounded-[16px]',
  'border border-solid border-subtle bg-bg-elevated text-fg-default',
  'shadow-md',
].join(' ');

export const rootRangeClass = [
  'flex w-full max-w-[400px] flex-col overflow-hidden rounded-[16px]',
  'border border-solid border-subtle bg-bg-elevated text-fg-default',
  'shadow-md',
  'md:max-w-[800px] md:flex-row',
].join(' ');

export const paneClass = 'flex w-full min-w-0 flex-1 flex-col md:max-w-[400px]';

export const paneDividerClass = 'border-b border-solid border-subtle md:border-r md:border-b-0';

export const headerClass =
  'flex w-full items-center justify-between border-b border-solid border-subtle p-[12px]';

export const navGroupClass = 'flex items-center';

export const gridClass = [
  'grid w-full grid-cols-7 justify-items-center gap-x-[8px] gap-y-[12px]',
  'px-[12px] py-[16px] min-[400px]:gap-x-[16px]',
].join(' ');

export const weekdayClass = 'flex w-full max-w-[40px] items-center justify-center';

export const dayCellClass =
  'relative flex aspect-square w-full max-w-[40px] items-center justify-center';

export const dayButtonClass =
  'h-full min-h-0 min-w-0 w-full max-h-[40px] max-w-[40px] rounded-full! p-0! font-body [font-variant-numeric:tabular-nums] aria-[current=date]:shadow-[inset_0_0_0_1px_var(--border-color-default)]!';

export const dayDefaultClass =
  'text-fg-default! hover:bg-bg-primary-subtle! hover:bg-[image:none]! hover:text-fg-primary! active:bg-bg-primary-subtle! active:bg-[image:none]!';

export const daySelectedClass = 'bg-bg-primary! text-fg-on-primary!';

export const dayRangeMiddleClass =
  'bg-bg-primary-subtle! text-fg-default! hover:bg-[image:none]! hover:text-fg-primary!';

export const dayOutsideClass =
  'pointer-events-none cursor-default text-fg-secondary! hover:bg-transparent! active:bg-transparent!';

export const fieldRootClass = 'relative flex w-full min-w-0 flex-col';

export const popoverClass =
  'absolute top-full left-0 z-(--z-dropdown) mt-[4px] w-max max-w-[calc(100vw-32px)]';

export const DEFAULT_PLACEHOLDER = 'Pick a date';

export const DEFAULT_RANGE_PLACEHOLDER = 'Pick a date range';
