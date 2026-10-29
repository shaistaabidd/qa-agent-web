import type { KeyboardEvent } from 'react';

import { DatePickerMonth } from './date-picker-month';
import type { DatePickerMonths, DateRangeValue } from './types';
import { addMonths, getPaneClassName, getRootClassName } from './utils';

export function DatePickerCalendar({
  disabled,
  displayMonth,
  focusedDate,
  maxDate,
  minDate,
  months,
  onDaySelect,
  onKeyDown,
  onNextMonth,
  onNextYear,
  onPrevMonth,
  onPrevYear,
  selected,
}: {
  disabled?: boolean;
  displayMonth: Date;
  focusedDate: Date;
  maxDate?: Date;
  minDate?: Date;
  months: DatePickerMonths;
  onDaySelect: (date: Date) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onNextMonth: () => void;
  onNextYear: () => void;
  onPrevMonth: () => void;
  onPrevYear: () => void;
  selected: DateRangeValue;
}) {
  const paneMonths = Array.from({ length: months }, (_, index) => addMonths(displayMonth, index));

  return (
    <div
      className={getRootClassName(months)}
      data-disabled={disabled || undefined}
      data-months={months}
      data-slot="date-picker-calendar"
    >
      {paneMonths.map((month, index) => (
        <DatePickerMonth
          className={getPaneClassName(months, index)}
          disabled={disabled}
          focusedDate={focusedDate}
          key={`${month.getFullYear()}-${month.getMonth()}`}
          hiddenMonths={paneMonths.filter((_, paneIndex) => paneIndex !== index)}
          maxDate={maxDate}
          minDate={minDate}
          month={month}
          onDayKeyDown={onKeyDown}
          onDaySelect={onDaySelect}
          onNextMonth={onNextMonth}
          onNextYear={onNextYear}
          onPrevMonth={onPrevMonth}
          onPrevYear={onPrevYear}
          selected={selected}
        />
      ))}
    </div>
  );
}
