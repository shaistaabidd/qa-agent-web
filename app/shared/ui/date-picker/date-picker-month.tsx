import { CaretDoubleLeftIcon } from '@phosphor-icons/react/CaretDoubleLeft';
import { CaretDoubleRightIcon } from '@phosphor-icons/react/CaretDoubleRight';
import { CaretLeftIcon } from '@phosphor-icons/react/CaretLeft';
import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import { type KeyboardEvent, useMemo } from 'react';

import { useStableCallback } from '@/shared/lib/use-latest-ref';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import {
  dayCellClass,
  gridClass,
  headerClass,
  navGroupClass,
  WEEKDAY_LABELS,
  weekdayClass,
} from './constants';
import { DatePickerDay } from './date-picker-day';
import type { DateRangeValue } from './types';
import {
  formatMonthYear,
  getMonthGrid,
  isDayDisabled,
  isHiddenOverflowDay,
  isInRange,
  isSameDay,
  isSameMonth,
} from './utils';

export function DatePickerMonth({
  className,
  disabled,
  focusedDate,
  hiddenMonths = [],
  maxDate,
  minDate,
  month,
  onDayKeyDown,
  onDaySelect,
  onNextMonth,
  onNextYear,
  onPrevMonth,
  onPrevYear,
  selected,
}: {
  className?: string;
  disabled?: boolean;
  focusedDate: Date;
  hiddenMonths?: Date[];
  maxDate?: Date;
  minDate?: Date;
  month: Date;
  onDayKeyDown: (event: KeyboardEvent) => void;
  onDaySelect: (date: Date) => void;
  onNextMonth: () => void;
  onNextYear: () => void;
  onPrevMonth: () => void;
  onPrevYear: () => void;
  selected: DateRangeValue;
}) {
  const monthTime = month.getTime();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the timestamp so a new Date with the same value reuses the grid
  const days = useMemo(() => getMonthGrid(month), [monthTime]);
  const stableKeyDown = useStableCallback(onDayKeyDown);
  const stableSelect = useStableCallback(onDaySelect);
  const monthLabel = formatMonthYear(month);
  const today = useMemo(() => new Date(), []);

  return (
    <div className={cn(className)} data-slot="date-picker-month">
      <div className={headerClass} data-slot="date-picker-header">
        <div className={navGroupClass}>
          <Button
            aria-label="Previous year"
            disabled={disabled}
            onClick={onPrevYear}
            size="icon-md"
            type="button"
            variant="ghost"
          >
            <CaretDoubleLeftIcon aria-hidden weight="light" />
          </Button>
          <Button
            aria-label="Previous month"
            disabled={disabled}
            onClick={onPrevMonth}
            size="icon-md"
            type="button"
            variant="ghost"
          >
            <CaretLeftIcon aria-hidden weight="light" />
          </Button>
        </div>
        <Typography
          as="p"
          className="whitespace-nowrap text-fg-default"
          fontWeight="medium"
          size="sm"
        >
          {monthLabel}
        </Typography>
        <div className={navGroupClass}>
          <Button
            aria-label="Next month"
            disabled={disabled}
            onClick={onNextMonth}
            size="icon-md"
            type="button"
            variant="ghost"
          >
            <CaretRightIcon aria-hidden weight="light" />
          </Button>
          <Button
            aria-label="Next year"
            disabled={disabled}
            onClick={onNextYear}
            size="icon-md"
            type="button"
            variant="ghost"
          >
            <CaretDoubleRightIcon aria-hidden weight="light" />
          </Button>
        </div>
      </div>
      <div aria-label={monthLabel} className={gridClass} data-slot="date-picker-grid" role="grid">
        {WEEKDAY_LABELS.map((label) => (
          <div className={weekdayClass} key={label} role="columnheader">
            <Typography as="span" className="text-fg-secondary" fontWeight="medium" size="xs">
              {label}
            </Typography>
          </div>
        ))}
        {days.map((date) => {
          const outside = !isSameMonth(date, month);
          const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

          if (outside && isHiddenOverflowDay(date, hiddenMonths)) {
            return <div className={dayCellClass} key={dayKey} role="gridcell" />;
          }

          const dayDisabled =
            !outside && (Boolean(disabled) || isDayDisabled(date, minDate, maxDate));
          const isStart = Boolean(selected.from && isSameDay(date, selected.from));
          const isEnd = Boolean(selected.to && isSameDay(date, selected.to));

          return (
            <DatePickerDay
              date={date}
              disabled={dayDisabled}
              focused={!dayDisabled && isSameDay(date, focusedDate)}
              key={dayKey}
              onKeyDown={stableKeyDown}
              onSelect={stableSelect}
              outside={outside}
              rangeMiddle={!outside && isInRange(date, selected.from, selected.to)}
              selected={!outside && (isStart || isEnd)}
              today={isSameDay(date, today)}
            />
          );
        })}
      </div>
    </div>
  );
}
