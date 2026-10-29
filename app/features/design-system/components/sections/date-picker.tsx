import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { DatePicker, type DateRangeValue } from '@/shared/ui/date-picker';
import { Label } from '@/shared/ui/label';

export function DatePickerSection() {
  const [date, setDate] = useState<Date | undefined>();
  const [rangeDate, setRangeDate] = useState<Date | undefined>();
  const [range, setRange] = useState<DateRangeValue>({});

  return (
    <ComponentSection
      description="Type a date or open the calendar and choose a day. Arrow keys move between days, and the clear button removes the date."
      id="date-picker"
      title="Date Picker"
    >
      <Example
        contentClassName="w-full max-w-[400px] flex-col items-stretch overflow-visible"
        description="Open the calendar, pick a day, and the field shows that date."
        title="Single date"
      >
        <div className="flex w-full flex-col gap-[8px]">
          <Label htmlFor="date-picker-single">Date</Label>
          <DatePicker id="date-picker-single" onValueChange={setDate} value={date} />
        </div>
      </Example>

      <Example
        contentClassName="w-full max-w-[400px] flex-col items-stretch overflow-visible"
        description="Two months in the popover. They stack on small screens."
        title="Two months"
      >
        <div className="flex w-full flex-col gap-[8px]">
          <Label htmlFor="date-picker-two-month">Date</Label>
          <DatePicker
            id="date-picker-two-month"
            months={2}
            onValueChange={setRangeDate}
            value={rangeDate}
          />
        </div>
      </Example>

      <Example
        contentClassName="w-full max-w-[400px] flex-col items-stretch overflow-visible"
        description="Click a start date, then an end date. Both appear in the field."
        title="Date range"
      >
        <div className="flex w-full flex-col gap-[8px]">
          <Label htmlFor="date-picker-range">Date range</Label>
          <DatePicker
            id="date-picker-range"
            mode="range"
            months={2}
            onValueChange={setRange}
            value={range}
          />
        </div>
      </Example>
    </ComponentSection>
  );
}
