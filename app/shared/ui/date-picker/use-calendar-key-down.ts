import type {
  Dispatch,
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
  SetStateAction,
} from 'react';

import { ARROW_DAY_STEP } from './constants';
import {
  addDays,
  addMonths,
  isBeforeDay,
  isDayDisabled,
  isMonthVisible,
  startOfDay,
  startOfMonth,
} from './utils';

type CalendarKeyDownOptions = {
  activeDate: Date;
  maxDate?: Date;
  minDate?: Date;
  months: number;
  pendingDayFocus: RefObject<boolean>;
  setDisplayMonth: Dispatch<SetStateAction<Date>>;
  setFocusedDate: (date: Date) => void;
};

/** Arrow keys move the focused day and scroll the visible months with it. */
export function useCalendarKeyDown({
  activeDate,
  maxDate,
  minDate,
  months,
  pendingDayFocus,
  setDisplayMonth,
  setFocusedDate,
}: CalendarKeyDownOptions) {
  return function onCalendarKeyDown(event: ReactKeyboardEvent) {
    const step = ARROW_DAY_STEP[event.key as keyof typeof ARROW_DAY_STEP];

    if (step == null) {
      return;
    }

    event.preventDefault();
    const next = addDays(activeDate, step);

    if (isDayDisabled(next, minDate, maxDate)) {
      return;
    }

    pendingDayFocus.current = true;
    const day = startOfDay(next);
    setFocusedDate(day);
    setDisplayMonth((current) => {
      if (isMonthVisible(day, current, months)) {
        return current;
      }

      if (isBeforeDay(day, startOfMonth(current))) {
        return startOfMonth(day);
      }

      return addMonths(startOfMonth(day), -(months - 1));
    });
  };
}
