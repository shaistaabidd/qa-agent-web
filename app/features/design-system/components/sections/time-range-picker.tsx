import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { type DayAvailability, TimeRangePicker } from '@/shared/ui/time-range-picker';

const INITIAL: DayAvailability[] = [
  { day: 'mon', enabled: true, ranges: [{ start: '09:00', end: '17:00' }] },
  { day: 'tue', enabled: true, ranges: [{ start: '09:00', end: '17:00' }] },
  { day: 'wed', enabled: false, ranges: [{ start: '09:00', end: '17:00' }] },
];

export function TimeRangePickerSection() {
  const [value, setValue] = useState(INITIAL);

  return (
    <ComponentSection
      description="Weekly availability editor with overlapping-range checks."
      id="time-range-picker"
      title="Time Range Picker"
    >
      <Example contentClassName="block w-full max-w-[480px]" title="Week days">
        <TimeRangePicker onChange={setValue} value={value} />
      </Example>
    </ComponentSection>
  );
}
