import { cn } from '@/shared/lib/utils';

import {
  CALENDAR_CELLS,
  dayButtonClass,
  dayDefaultClass,
  dayOutsideClass,
  dayRangeMiddleClass,
  daySelectedClass,
  paneClass,
  paneDividerClass,
  rootRangeClass,
  rootSingleClass,
} from './constants';
import type { DatePickerMonths, DateRangeValue } from './types';

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function addYears(date: Date, amount: number) {
  return new Date(date.getFullYear() + amount, date.getMonth(), 1);
}

export function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function isBeforeDay(left: Date, right: Date) {
  return startOfDay(left).getTime() < startOfDay(right).getTime();
}

export function isAfterDay(left: Date, right: Date) {
  return startOfDay(left).getTime() > startOfDay(right).getTime();
}

export function isDayDisabled(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && isBeforeDay(date, minDate)) {
    return true;
  }

  if (maxDate && isAfterDay(date, maxDate)) {
    return true;
  }

  return false;
}

export function clampToRange(date: Date, minDate?: Date, maxDate?: Date) {
  if (minDate && isBeforeDay(date, minDate)) {
    return startOfDay(minDate);
  }

  if (maxDate && isAfterDay(date, maxDate)) {
    return startOfDay(maxDate);
  }

  return startOfDay(date);
}

export function isMonthVisible(date: Date, displayMonth: Date, months: number) {
  const first = startOfMonth(displayMonth);
  const afterLast = addMonths(first, months);

  return !isBeforeDay(date, first) && isBeforeDay(date, afterLast);
}

export function getMonthGrid(month: Date) {
  const first = startOfMonth(month);
  const gridStart = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());

  return Array.from({ length: CALENDAR_CELLS }, (_, index) => {
    return new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
  });
}

const dayLabelFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric',
});

export function formatDayLabel(date: Date) {
  return dayLabelFormatter.format(date);
}

export function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function formatDisplayDate(date?: Date) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDisplayValue(selected: DateRangeValue, isRange: boolean) {
  if (!selected.from) {
    return '';
  }

  if (!isRange || !selected.to) {
    return formatDisplayDate(selected.from);
  }

  return `${formatDisplayDate(selected.from)} – ${formatDisplayDate(selected.to)}`;
}

export function formatISODate(date?: Date) {
  if (!date) {
    return '';
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatHiddenValue(selected: DateRangeValue, isRange: boolean) {
  if (!selected.from) {
    return '';
  }

  if (!isRange || !selected.to) {
    return formatISODate(selected.from);
  }

  return `${formatISODate(selected.from)}/${formatISODate(selected.to)}`;
}

export function isInRange(date: Date, from?: Date, to?: Date) {
  if (!from || !to) {
    return false;
  }

  const time = startOfDay(date).getTime();
  const start = startOfDay(from).getTime();
  const end = startOfDay(to).getTime();

  return time > start && time < end;
}

export function toRangeValue(
  value: Date | DateRangeValue | undefined,
  isRange: boolean,
): DateRangeValue {
  if (value == null) {
    return {};
  }

  if (value instanceof Date) {
    return { from: value };
  }

  if (isRange) {
    return value;
  }

  return { from: value.from };
}

export function getRootClassName(months: DatePickerMonths, className?: string) {
  return cn(months === 2 ? rootRangeClass : rootSingleClass, className);
}

export function getPaneClassName(months: DatePickerMonths, index: number) {
  return cn(paneClass, months === 2 && index === 0 && paneDividerClass);
}

export function isHiddenOverflowDay(date: Date, hiddenMonths: Date[]) {
  return hiddenMonths.some((month) => isSameMonth(date, month));
}

export function getDayButtonClassName(options: {
  outside: boolean;
  rangeMiddle: boolean;
  selected: boolean;
}) {
  if (options.outside) {
    return cn(dayButtonClass, dayOutsideClass);
  }

  if (options.selected) {
    return cn(dayButtonClass, daySelectedClass);
  }

  if (options.rangeMiddle) {
    return cn(dayButtonClass, dayRangeMiddleClass);
  }

  return cn(dayButtonClass, dayDefaultClass);
}
