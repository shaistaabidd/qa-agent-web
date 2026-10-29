import { useEffect, useId, useRef, useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Label } from '@/shared/ui/label';
import { MultiSelect, MultiSelectItem } from '@/shared/ui/multi-select';

const STATES = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'alaska', label: 'Alaska' },
  { value: 'arizona', label: 'Arizona' },
  { value: 'arkansas', label: 'Arkansas' },
  { value: 'california', label: 'California' },
  { value: 'colorado', label: 'Colorado' },
  { value: 'connecticut', label: 'Connecticut' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'florida', label: 'Florida' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'illinois', label: 'Illinois' },
  { value: 'new-york', label: 'New York' },
  { value: 'texas', label: 'Texas' },
];

const CHIP_DEFAULTS = [
  'alabama',
  'alaska',
  'arizona',
  'arkansas',
  'california',
  'colorado',
  'connecticut',
  'delaware',
  'florida',
  'georgia',
];

const MANY_ITEMS = Array.from({ length: 40 }, (_, index) => ({
  label: `Item ${index + 1}`,
  value: `item-${index + 1}`,
}));

function LicenseStatesField({
  disabled,
  error,
  showSelected = true,
  defaultValue,
}: {
  disabled?: boolean;
  error?: boolean;
  showSelected?: boolean;
  defaultValue?: string[];
}) {
  const id = useId();
  const [value, setValue] = useState<string[]>(defaultValue ?? []);

  return (
    <div className="flex w-full max-w-[491px] flex-col gap-[8px]">
      <Label error={error} htmlFor={id} required>
        Licensed States
      </Label>
      <MultiSelect
        disabled={disabled}
        error={error}
        id={id}
        onValueChange={setValue}
        placeholder="Type to search a state..."
        showSelected={showSelected}
        size="xl"
        value={value}
      >
        {STATES.map((state) => (
          <MultiSelectItem key={state.value} value={state.value}>
            {state.label}
          </MultiSelectItem>
        ))}
      </MultiSelect>
    </div>
  );
}

function InfiniteScrollField() {
  const id = useId();
  const [value, setValue] = useState<string[]>(['item-1']);
  const [limit, setLimit] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const timerRef = useRef(0);
  const items = MANY_ITEMS.slice(0, limit);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function handleLoadMore() {
    if (loadingMore || limit >= MANY_ITEMS.length) {
      return;
    }

    setLoadingMore(true);
    timerRef.current = window.setTimeout(() => {
      setLimit((current) => Math.min(current + 10, MANY_ITEMS.length));
      setLoadingMore(false);
    }, 400);
  }

  return (
    <div className="flex w-full max-w-[491px] flex-col gap-[8px]">
      <Label htmlFor={id}>Items</Label>
      <MultiSelect
        id={id}
        loadingMore={loadingMore}
        onLoadMore={handleLoadMore}
        onValueChange={setValue}
        placeholder="Select items..."
        value={value}
      >
        {items.map((item) => (
          <MultiSelectItem key={item.value} value={item.value}>
            {item.label}
          </MultiSelectItem>
        ))}
      </MultiSelect>
    </div>
  );
}

export function MultiSelectDemo() {
  return (
    <ComponentSection
      description="Searchable multi-select. Options use checkboxes. Selected values can be shown as chips below the field, or hidden when the surrounding screen already displays them."
      id="multi-select"
      title="Multi Select"
    >
      <Example
        contentClassName="w-full flex-col items-stretch overflow-visible"
        description="Open the menu to search and toggle states. Selected values render as removable chips under the field. Clear all appears once more than one value is selected."
        title="With selected chips"
      >
        <LicenseStatesField defaultValue={CHIP_DEFAULTS} />
      </Example>
      <Example
        contentClassName="w-full flex-col items-stretch overflow-visible"
        description="Same field without the chip list. Selection still shows as checkboxes in the menu."
        title="Without chips"
      >
        <LicenseStatesField defaultValue={['alaska', 'alabama', 'arizona']} showSelected={false} />
      </Example>
      <Example
        contentClassName="w-full flex-col items-stretch overflow-visible"
        description="Scroll to the bottom of the menu to fetch the next page. The caret becomes a spinner while more items load. Use loading for the first page (menu stays closed) and loadingMore + onLoadMore for later pages."
        title="Infinite scroll"
      >
        <InfiniteScrollField />
      </Example>
      <Example
        contentClassName="w-full flex-col items-stretch overflow-visible"
        description="Invalid and disabled use the same trigger treatment as Input, Dropdown, and Combobox."
        title="Error and disabled"
      >
        <div className="flex w-full flex-col gap-[24px]">
          <LicenseStatesField error />
          <LicenseStatesField defaultValue={['texas']} disabled />
        </div>
      </Example>
    </ComponentSection>
  );
}
