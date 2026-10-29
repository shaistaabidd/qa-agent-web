import {
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { isTypedDateComplete, maskTypedDigits, parseTypedValue } from './parse-typed';
import type { DatePickerProps, DatePickerRangeProps, DateRangeValue } from './types';
import { useCalendarKeyDown } from './use-calendar-key-down';
import { useDatePickerDismiss } from './use-date-picker-dismiss';
import {
  addMonths,
  clampToRange,
  formatDisplayValue,
  formatHiddenValue,
  isBeforeDay,
  isDayDisabled,
  isMonthVisible,
  startOfDay,
  startOfMonth,
  toRangeValue,
} from './utils';

// Single and range selection share one view, focus, and input state, so they stay in one hook.

function isRangeProps(props: DatePickerProps): props is DatePickerRangeProps {
  return props.mode === 'range';
}

// Typed input and calendar keys update the same selection, so they stay in this hook.
export function useDatePicker(props: DatePickerProps) {
  const {
    defaultMonth,
    defaultOpen = false,
    disabled,
    id,
    maxDate,
    minDate,
    months = 1,
    onOpenChange,
    open: openProp,
  } = props;
  const generatedId = useId();
  const pickerId = id ?? generatedId;
  const calendarId = `${pickerId}-calendar`;
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingDayFocus = useRef(false);
  const isRange = isRangeProps(props);
  const isOpenControlled = openProp !== undefined;
  const [uncontrolledSelected, setSelected] = useState<DateRangeValue>(() =>
    toRangeValue(props.defaultValue, isRange),
  );
  const isValueControlled = 'value' in props;
  const controlledValue = props.value;
  const controlledSelected = useMemo(
    () => toRangeValue(controlledValue, isRange),
    [controlledValue, isRange],
  );
  const selected = isValueControlled ? controlledSelected : uncontrolledSelected;
  const [draft, setDraft] = useState<string | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isOpenControlled ? openProp : uncontrolledOpen;
  const [displayMonth, setDisplayMonth] = useState(() =>
    startOfMonth(defaultMonth ?? selected.from ?? new Date()),
  );
  const [focusedDate, setFocusedDate] = useState(() =>
    clampToRange(selected.from ?? new Date(), minDate, maxDate),
  );
  const activeDate =
    isMonthVisible(focusedDate, displayMonth, months) &&
    !isDayDisabled(focusedDate, minDate, maxDate)
      ? focusedDate
      : clampToRange(startOfMonth(displayMonth), minDate, maxDate);

  function setOpen(next: boolean) {
    if (disabled && next) {
      return;
    }

    if (!isOpenControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);
  }

  function commit(next: DateRangeValue, close: boolean) {
    if (!isValueControlled) {
      setSelected(next);
    }

    if (isRangeProps(props)) {
      props.onValueChange?.(next);
    } else {
      props.onValueChange?.(next.from);
    }

    if (close) {
      setOpen(false);
    }
  }

  function applyTypedValue(text: string, close: boolean) {
    setDraft(null);
    const parsed = parseTypedValue(text, isRange);
    const blocked =
      !parsed ||
      (parsed.from && isDayDisabled(parsed.from, minDate, maxDate)) ||
      (parsed.to && isDayDisabled(parsed.to, minDate, maxDate));

    if (!parsed || blocked) {
      return undefined;
    }

    if (parsed.from) {
      setFocusedDate(startOfDay(parsed.from));
      setDisplayMonth(startOfMonth(parsed.from));
    }

    const finished = !isRange || !parsed.from || Boolean(parsed.to);
    commit(parsed, close && finished);
    return parsed.from;
  }

  function onDaySelect(date: Date) {
    if (disabled || isDayDisabled(date, minDate, maxDate)) {
      return;
    }

    setDraft(null);
    setFocusedDate(startOfDay(date));

    if (!isRange) {
      commit({ from: date }, true);
      return;
    }

    if (!selected.from || selected.to) {
      commit({ from: date }, false);
      return;
    }

    if (isBeforeDay(date, selected.from)) {
      commit({ from: date, to: selected.from }, true);
      return;
    }

    commit({ from: selected.from, to: date }, true);
  }

  function shiftDisplayMonth(amount: number) {
    const nextMonth = addMonths(displayMonth, amount);
    setDisplayMonth(nextMonth);
    setFocusedDate((current) =>
      isMonthVisible(current, nextMonth, months)
        ? current
        : clampToRange(startOfMonth(nextMonth), minDate, maxDate),
    );
  }

  function focusCalendarDay(preferred?: Date) {
    const next = clampToRange(preferred ?? selected.from ?? new Date(), minDate, maxDate);
    pendingDayFocus.current = true;
    setFocusedDate(next);
    setDisplayMonth(startOfMonth(next));
    setOpen(true);
  }

  function clearValue() {
    setDraft(null);
    commit({}, true);
  }

  useDatePickerDismiss(open, rootRef, setOpen);

  const activeTime = activeDate.getTime();

  useLayoutEffect(() => {
    if (!pendingDayFocus.current) {
      return;
    }

    const button = rootRef.current?.querySelector<HTMLButtonElement>('button[data-focused="true"]');

    if (!button) {
      return;
    }

    button.focus();
    pendingDayFocus.current = false;
  }, [activeTime, open]);

  const onCalendarKeyDown = useCalendarKeyDown({
    activeDate,
    maxDate,
    minDate,
    months,
    pendingDayFocus,
    setDisplayMonth,
    setFocusedDate,
  });

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (disabled) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusCalendarDay(draft === null ? undefined : applyTypedValue(draft, false));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (draft !== null) {
        applyTypedValue(draft, true);
        return;
      }

      focusCalendarDay();
      return;
    }

    if (event.key === 'Escape' && (open || draft !== null)) {
      event.preventDefault();

      if (draft !== null) {
        applyTypedValue(draft, false);
      }

      setOpen(false);
    }
  }

  function handleInputBlur(event: ReactFocusEvent<HTMLInputElement>) {
    const next = event.relatedTarget;
    const stayedInside = next instanceof Node && Boolean(rootRef.current?.contains(next));
    const movedToDay =
      next instanceof Element && Boolean(next.closest('[data-slot="date-picker-day"]'));

    if (!movedToDay && draft !== null) {
      applyTypedValue(draft, false);
    } else if (movedToDay) {
      setDraft(null);
    }

    if (!stayedInside && !open) {
      onOpenChange?.(false);
    }
  }

  const displayValue = draft ?? formatDisplayValue(selected, isRange);

  function handleInputChange(value: string) {
    if (/[A-Za-z]/.test(value)) {
      setDraft(value);
      return;
    }

    let digits = value.replace(/\D/g, '');

    // Backspacing over an auto-inserted separator should remove the digit before it.
    if (value.length < displayValue.length && digits === displayValue.replace(/\D/g, '')) {
      digits = digits.slice(0, -1);
    }

    const masked = maskTypedDigits(digits, isRange);

    setDraft(masked);

    if (isTypedDateComplete(digits, isRange) && parseTypedValue(masked, isRange)) {
      applyTypedValue(masked, true);
    }
  }

  return {
    calendarId,
    canClear: !disabled && displayValue.length > 0,
    clearValue,
    disabled,
    displayMonth,
    displayValue,
    focusedDate: activeDate,
    handleInputBlur,
    handleInputChange,
    handleTriggerKeyDown,
    hiddenValue: formatHiddenValue(selected, isRange),
    maxDate,
    minDate,
    months,
    onCalendarKeyDown,
    onDaySelect,
    onNextMonth: () => shiftDisplayMonth(1),
    onNextYear: () => shiftDisplayMonth(12),
    onPrevMonth: () => shiftDisplayMonth(-1),
    onPrevYear: () => shiftDisplayMonth(-12),
    open,
    pickerId,
    rootRef,
    selected,
    setOpen,
  };
}
