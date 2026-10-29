import { type KeyboardEvent, memo } from 'react';

import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import { dayCellClass } from './constants';
import { formatDayLabel, getDayButtonClassName } from './utils';

export const DatePickerDay = memo(function DatePickerDay({
  date,
  disabled,
  focused,
  onKeyDown,
  onSelect,
  outside,
  rangeMiddle,
  selected,
  today,
}: {
  date: Date;
  disabled?: boolean;
  focused: boolean;
  onKeyDown: (event: KeyboardEvent) => void;
  onSelect: (date: Date) => void;
  outside: boolean;
  rangeMiddle: boolean;
  selected: boolean;
  today: boolean;
}) {
  const inactive = Boolean(disabled || outside);

  return (
    <div
      className={dayCellClass}
      data-outside={outside || undefined}
      data-selected={selected || undefined}
      data-slot="date-picker-day"
      data-today={today || undefined}
      role="gridcell"
    >
      <Button
        aria-current={today && !outside ? 'date' : undefined}
        aria-disabled={inactive || undefined}
        aria-hidden={outside || undefined}
        aria-label={formatDayLabel(date)}
        aria-pressed={selected || undefined}
        className={getDayButtonClassName({
          outside,
          rangeMiddle,
          selected,
        })}
        data-focused={focused || undefined}
        disabled={disabled}
        onClick={() => {
          if (inactive) {
            return;
          }

          onSelect(date);
        }}
        onKeyDown={onKeyDown}
        size="sm"
        tabIndex={focused ? 0 : -1}
        type="button"
        variant="ghost"
      >
        <Typography as="span" fontWeight="regular" size="sm">
          {date.getDate()}
        </Typography>
      </Button>
    </div>
  );
});
