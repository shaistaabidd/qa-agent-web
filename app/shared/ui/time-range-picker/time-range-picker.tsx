import { PlusIcon } from '@phosphor-icons/react/Plus';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { useId, useMemo } from 'react';

import { moveFocus } from '@/shared/lib/focus';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';

import { generateTimeOptions } from './generate-time-options';
import { type TimeOption, TimeSelect } from './time-select';
import {
  findOverlappingRanges,
  nextAvailableRange,
  type TimeRange,
  toMinutes,
} from './validate-ranges';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

type DayAvailability = {
  day: DayKey;
  enabled: boolean;
  ranges: TimeRange[];
};

const DEFAULT_LABELS: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

type TimeRangePickerProps = {
  value: DayAvailability[];
  onChange: (value: DayAvailability[]) => void;
  stepMinutes?: number;
  dayLabels?: Partial<Record<DayKey, string>>;
  className?: string;
};

function nextOptionAfter(options: TimeOption[], hhmm: string): string | undefined {
  const minutes = toMinutes(hhmm);
  return options.find((opt) => toMinutes(opt.value) > minutes)?.value;
}

function TimeRangePicker({
  value,
  onChange,
  stepMinutes = 30,
  dayLabels,
  className,
}: TimeRangePickerProps) {
  const pickerId = useId();
  const options = useMemo(() => generateTimeOptions(stepMinutes), [stepMinutes]);
  const labels = { ...DEFAULT_LABELS, ...dayLabels };

  function setDayEnabled(day: DayKey, enabled: boolean) {
    onChange(
      value.map((d) => {
        if (d.day !== day) return d;
        if (!enabled || d.ranges.length > 0) return { ...d, enabled };
        const range = nextAvailableRange([], options);
        return range ? { ...d, enabled: true, ranges: [range] } : { ...d, enabled: false };
      }),
    );
  }

  function updateRange(day: DayKey, index: number, patch: Partial<TimeRange>) {
    onChange(
      value.map((d) => {
        if (d.day !== day) return d;
        const ranges = d.ranges.map((r, i) => (i === index ? { ...r, ...patch } : r));
        return { ...d, ranges };
      }),
    );
  }

  function setStart(day: DayKey, index: number, start: string) {
    const current = value.find((d) => d.day === day)?.ranges[index];
    if (!current) return;
    let end = current.end;
    if (toMinutes(start) >= toMinutes(end)) {
      const next = nextOptionAfter(options, start);
      if (!next) return;
      end = next;
    }
    updateRange(day, index, { start, end });
  }

  function setEnd(day: DayKey, index: number, end: string) {
    const current = value.find((d) => d.day === day)?.ranges[index];
    if (!current) return;
    if (toMinutes(end) <= toMinutes(current.start)) return;
    updateRange(day, index, { end });
  }

  function addRange(day: DayKey) {
    onChange(
      value.map((d) => {
        if (d.day !== day) return d;
        const range = nextAvailableRange(d.ranges, options);
        return range ? { ...d, ranges: [...d.ranges, range] } : d;
      }),
    );
  }

  function removeRange(day: DayKey, index: number) {
    onChange(
      value.map((d) => {
        if (d.day !== day) return d;
        const ranges = d.ranges.filter((_, i) => i !== index);
        return { ...d, ranges, enabled: ranges.length > 0 };
      }),
    );
  }

  return (
    <div className={cn('flex flex-col gap-[16px]', className)} data-slot="time-range-picker">
      {value.map((day) => {
        const overlaps = findOverlappingRanges(day.ranges);
        const overlapSet = new Set(overlaps.flat());
        const switchId = `${pickerId}-${day.day}-switch`;
        const overlapId = `${pickerId}-${day.day}-overlap`;
        const nextRange = nextAvailableRange(day.ranges, options);

        return (
          <div
            className="flex flex-col gap-[8px] border-b border-subtle pb-[16px] last:border-b-0 last:pb-0"
            data-slot="time-range-day"
            key={day.day}
          >
            <div className="flex items-center justify-between gap-[12px]">
              <Label bold htmlFor={switchId}>
                {labels[day.day]}
              </Label>
              <Switch
                checked={day.enabled}
                id={switchId}
                onCheckedChange={(enabled) => setDayEnabled(day.day, enabled)}
              />
            </div>

            {day.enabled ? (
              <div className="flex flex-col gap-[8px]">
                {day.ranges.map((range, index) => {
                  const startOptions = options.filter(
                    (opt) => toMinutes(opt.value) < toMinutes(range.end),
                  );
                  const endOptions = options.filter(
                    (opt) => toMinutes(opt.value) > toMinutes(range.start),
                  );
                  const overlapping = overlapSet.has(index);
                  const invalid = overlapping || toMinutes(range.start) >= toMinutes(range.end);
                  const describedBy = overlapping ? overlapId : undefined;

                  return (
                    <div
                      className="flex flex-nowrap items-center gap-[8px]"
                      data-slot="time-range-row"
                      key={range.id ?? index}
                    >
                      <TimeSelect
                        aria-describedby={describedBy}
                        aria-label={`${labels[day.day]} start`}
                        invalid={invalid}
                        labelOptions={options}
                        onValueChange={(start) => setStart(day.day, index, start)}
                        options={startOptions}
                        value={range.start}
                      />
                      <span className="shrink-0 text-xs text-fg-secondary">to</span>
                      <TimeSelect
                        aria-describedby={describedBy}
                        aria-label={`${labels[day.day]} end`}
                        invalid={invalid}
                        labelOptions={options}
                        onValueChange={(end) => setEnd(day.day, index, end)}
                        options={endOptions}
                        value={range.end}
                      />
                      <Button
                        aria-label="Remove range"
                        data-slot="time-range-remove"
                        onClick={(event) => {
                          const dayRoot = event.currentTarget.closest(
                            '[data-slot="time-range-day"]',
                          );
                          const addButton =
                            dayRoot?.querySelector<HTMLButtonElement>('[data-add-range]');
                          const lastRange = day.ranges.length === 1;
                          const focusTarget =
                            lastRange || addButton?.disabled
                              ? dayRoot?.querySelector<HTMLElement>('[data-slot="switch"]')
                              : addButton;
                          moveFocus(focusTarget);
                          removeRange(day.day, index);
                        }}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <TrashIcon aria-hidden className="size-[14px]" weight="regular" />
                      </Button>
                    </div>
                  );
                })}
                {overlaps.length > 0 ? (
                  <p className="text-xs text-fg-danger" id={overlapId}>
                    Overlapping time ranges
                  </p>
                ) : null}
                <Button
                  className="w-fit"
                  data-add-range=""
                  disabled={!nextRange}
                  onClick={() => addRange(day.day)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <PlusIcon aria-hidden className="size-[14px]" weight="regular" />
                  Add range
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export { DEFAULT_LABELS, TimeRangePicker };
export type { DayAvailability, DayKey, TimeRange, TimeRangePickerProps };
