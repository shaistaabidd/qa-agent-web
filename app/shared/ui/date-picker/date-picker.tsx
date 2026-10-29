import { CalendarBlankIcon } from '@phosphor-icons/react/CalendarBlank';
import { XIcon } from '@phosphor-icons/react/X';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import {
  DEFAULT_PLACEHOLDER,
  DEFAULT_RANGE_PLACEHOLDER,
  fieldRootClass,
  popoverClass,
} from './constants';
import { DatePickerCalendar } from './date-picker-calendar';
import type { DatePickerProps } from './types';
import { useDatePicker } from './use-date-picker';

export function DatePicker(props: DatePickerProps) {
  const { className, error, helperText, name, placeholder, size = 'lg' } = props;
  const {
    calendarId,
    canClear,
    clearValue,
    disabled,
    displayMonth,
    displayValue,
    focusedDate,
    handleInputBlur,
    handleInputChange,
    handleTriggerKeyDown,
    hiddenValue,
    maxDate,
    minDate,
    months,
    onCalendarKeyDown,
    onDaySelect,
    onNextMonth,
    onNextYear,
    onPrevMonth,
    onPrevYear,
    open,
    pickerId,
    rootRef,
    selected,
    setOpen,
  } = useDatePicker(props);
  const isRange = props.mode === 'range';

  return (
    <div
      className={cn(fieldRootClass, className)}
      data-disabled={disabled || undefined}
      data-open={open || undefined}
      data-slot="date-picker"
      ref={rootRef}
    >
      <div onClick={() => setOpen(true)} role="presentation">
        <Input
          aria-controls={open ? calendarId : undefined}
          aria-expanded={open}
          aria-haspopup="dialog"
          autoComplete="off"
          disabled={disabled}
          error={error}
          helperText={helperText}
          id={pickerId}
          onBlur={handleInputBlur}
          onChange={(event) => handleInputChange(event.target.value)}
          onKeyDown={handleTriggerKeyDown}
          placeholder={placeholder ?? (isRange ? DEFAULT_RANGE_PLACEHOLDER : DEFAULT_PLACEHOLDER)}
          rightIcon={
            <span className="flex items-center gap-[4px]">
              {canClear ? (
                <Button
                  aria-label="Clear date"
                  className="size-[20px] rounded-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    clearValue();
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  size="icon-sm"
                  variant="ghost"
                >
                  <XIcon aria-hidden weight="bold" />
                </Button>
              ) : null}
              <CalendarBlankIcon aria-hidden />
            </span>
          }
          role="combobox"
          size={size}
          value={displayValue}
        />
      </div>
      {name ? <input name={name} type="hidden" value={hiddenValue} /> : null}
      {open ? (
        <div className={popoverClass} data-slot="date-picker-popover" id={calendarId} role="dialog">
          <DatePickerCalendar
            disabled={disabled}
            displayMonth={displayMonth}
            focusedDate={focusedDate}
            maxDate={maxDate}
            minDate={minDate}
            months={months}
            onDaySelect={onDaySelect}
            onKeyDown={onCalendarKeyDown}
            onNextMonth={onNextMonth}
            onNextYear={onNextYear}
            onPrevMonth={onPrevMonth}
            onPrevYear={onPrevYear}
            selected={selected}
          />
        </div>
      ) : null}
    </div>
  );
}
