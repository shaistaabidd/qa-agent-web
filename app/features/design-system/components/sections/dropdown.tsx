import { BuildingsIcon } from '@phosphor-icons/react/Buildings';
import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import { MapPinIcon } from '@phosphor-icons/react/MapPin';
import { SunIcon } from '@phosphor-icons/react/Sun';
import { WavesIcon } from '@phosphor-icons/react/Waves';
import { useEffect, useId, useRef, useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { scrollbarClass } from '@/shared/lib/scrollbar';
import { Chip } from '@/shared/ui/chip';
import { Dropdown, DropdownItem } from '@/shared/ui/dropdown';
import type {
  DropdownItemInteraction,
  DropdownItemSize,
  DropdownSize,
} from '@/shared/ui/dropdown/types';
import { Label } from '@/shared/ui/label';

// Sizes, item states, and adornments stay together so this catalog section has one anchor.

const SIZES = ['sm', 'md', 'lg', 'xl'] as const;

const SIZE_LABELS: Record<DropdownSize, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};

const ITEM_SIZES: { size: DropdownItemSize; label: string }[] = [
  { size: 'lg', label: 'Large' },
  { size: 'sm', label: 'Small' },
];

const INTERACTIONS: { interaction: DropdownItemInteraction; label: string }[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
];

const STATES = [
  { value: 'texas', label: 'Texas' },
  { value: 'california', label: 'California' },
  { value: 'florida', label: 'Florida' },
  { value: 'new-york', label: 'New York' },
];

const ICON_STATES = [
  { value: 'texas', label: 'Texas', icon: MapPinIcon },
  { value: 'california', label: 'California', icon: SunIcon },
  { value: 'florida', label: 'Florida', icon: WavesIcon },
  { value: 'new-york', label: 'New York', icon: BuildingsIcon },
];

const MANY_ITEMS = Array.from({ length: 40 }, (_, index) => ({
  label: `Item ${index + 1}`,
  value: `item-${index + 1}`,
}));

function PreviewItem({
  interaction,
  size,
}: {
  interaction: DropdownItemInteraction;
  size: DropdownItemSize;
}) {
  return (
    <DropdownItem
      interaction={interaction}
      leftIcon={<MapPinIcon aria-hidden weight="light" />}
      rightIcon={<CaretRightIcon aria-hidden weight="light" />}
      size={size}
      supportingText="supporting text"
    >
      Primary text
    </DropdownItem>
  );
}

function StateField({
  id,
  label,
  loading,
  size,
}: {
  id?: string;
  label: string;
  loading?: boolean;
  size?: DropdownSize;
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [value, setValue] = useState('texas');

  return (
    <div className="flex w-full max-w-[360px] flex-col gap-[8px]">
      <Label htmlFor={fieldId}>{label}</Label>
      <Dropdown id={fieldId} loading={loading} onValueChange={setValue} size={size} value={value}>
        {STATES.map((state) => (
          <DropdownItem key={state.value} value={state.value}>
            {state.label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}

function IconField() {
  const id = useId();
  const [value, setValue] = useState('texas');

  return (
    <div className="flex w-full max-w-[360px] flex-col gap-[8px]">
      <Label htmlFor={id}>State</Label>
      <Dropdown id={id} onValueChange={setValue} value={value}>
        {ICON_STATES.map((state) => {
          const Icon = state.icon;

          return (
            <DropdownItem
              key={state.value}
              leftIcon={<Icon aria-hidden weight="light" />}
              value={state.value}
            >
              {state.label}
            </DropdownItem>
          );
        })}
      </Dropdown>
    </div>
  );
}

function RightIconField() {
  const id = useId();
  const [value, setValue] = useState('texas');

  return (
    <div className="flex w-full max-w-[360px] flex-col gap-[8px]">
      <Label htmlFor={id}>State</Label>
      <Dropdown id={id} onValueChange={setValue} value={value}>
        {STATES.map((state) => (
          <DropdownItem
            key={state.value}
            rightIcon={<CaretRightIcon aria-hidden className="size-[24px]" weight="light" />}
            value={state.value}
          >
            {state.label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}

function RadioChipField() {
  const [value, setValue] = useState('shipped');

  return (
    <Dropdown
      aria-label="Status"
      indicator="radio"
      onValueChange={setValue}
      trigger={
        <Chip
          leftAdornment={<BuildingsIcon aria-hidden weight="regular" />}
          rightIcon={<CaretDownIcon aria-hidden weight="bold" />}
          selected={value !== 'all'}
          size="lg"
        >
          Status
        </Chip>
      }
      value={value}
    >
      <DropdownItem value="shipped">Shipped</DropdownItem>
      <DropdownItem value="completed">Completed</DropdownItem>
      <DropdownItem value="cancelled">Cancelled</DropdownItem>
    </Dropdown>
  );
}

function InfiniteScrollField() {
  const id = useId();
  const [value, setValue] = useState('item-1');
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
    <div className="flex w-full max-w-[360px] flex-col gap-[8px]">
      <Label htmlFor={id}>Item</Label>
      <Dropdown
        id={id}
        loadingMore={loadingMore}
        onLoadMore={handleLoadMore}
        onValueChange={setValue}
        value={value}
      >
        {items.map((item) => (
          <DropdownItem key={item.value} value={item.value}>
            {item.label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}

export function DropdownSection() {
  return (
    <ComponentSection
      id="dropdown"
      title="Dropdown"
      description="A simple select. Pair it with Label. The selected option shows a check on the right."
    >
      <Example
        title="Dropdown Item"
        description="Large and small, default and hover. Left icon, supporting text, and a chevron are optional."
        contentClassName={['overflow-x-auto', scrollbarClass].join(' ')}
      >
        <div className="grid grid-cols-[auto_repeat(2,minmax(240px,1fr))] items-center gap-x-6 gap-y-6">
          <span />
          {INTERACTIONS.map(({ interaction, label }) => (
            <span
              key={interaction}
              className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]"
            >
              {label}
            </span>
          ))}
          {ITEM_SIZES.map(({ size, label }) => (
            <div key={size} className="contents">
              <span className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]">
                {label}
              </span>
              {INTERACTIONS.map(({ interaction }) => (
                <PreviewItem key={`${size}-${interaction}`} interaction={interaction} size={size} />
              ))}
            </div>
          ))}
        </div>
      </Example>

      <Example
        title="Sizes"
        description="sm, md, lg, xl. Default size is lg, matching Input."
        contentClassName="items-start overflow-visible"
      >
        {SIZES.map((size) => (
          <StateField key={size} label={SIZE_LABELS[size]} size={size} />
        ))}
      </Example>

      <Example
        title="Loading"
        description="Spinner replaces the caret on the right while the first page loads. The menu stays closed."
        contentClassName="items-start overflow-visible"
      >
        <StateField label="State" loading />
      </Example>

      <Example
        title="Infinite scroll"
        description="Scroll to the bottom of a long list to fetch the next page. The spinner replaces the caret in the field while more load."
        contentClassName="w-full flex-col items-stretch overflow-visible"
      >
        <InfiniteScrollField />
      </Example>

      <Example
        title="Simple select"
        description="Input-styled trigger with a caret. Open the menu to choose one option."
        contentClassName="w-full flex-col items-stretch overflow-visible"
      >
        <StateField label="State" />
      </Example>

      <Example
        title="With icons"
        description="Same dropdown. Pass leftIcon on DropdownItem. No extra component."
        contentClassName="w-full flex-col items-stretch overflow-visible"
      >
        <IconField />
      </Example>

      <Example
        title="With right icons"
        description="Pass rightIcon on DropdownItem. It replaces the selected check."
        contentClassName="w-full flex-col items-stretch overflow-visible"
      >
        <RightIconField />
      </Example>

      <Example
        title="Radio indicator"
        description='indicator="radio" shows a radio on the left of each option. Pass trigger for a Chip filter (or any custom control).'
        contentClassName="items-start overflow-visible"
      >
        <RadioChipField />
      </Example>
    </ComponentSection>
  );
}
