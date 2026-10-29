import { FilesIcon } from '@phosphor-icons/react/Files';
import { ImageSquareIcon } from '@phosphor-icons/react/ImageSquare';
import { UserIcon } from '@phosphor-icons/react/User';
import { WarningIcon } from '@phosphor-icons/react/Warning';
import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Segmented, SegmentedItem } from '@/shared/ui/segmented';
import type { SegmentedItemInteraction } from '@/shared/ui/segmented/types';

const ITEM_STATES: { interaction: SegmentedItemInteraction; label: string }[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
  { interaction: 'active', label: 'Active' },
];

const TEXT_ITEMS = [
  { value: 'overview', label: 'Overview' },
  { value: 'requests', label: 'Requests' },
  { value: 'documents', label: 'Documents' },
  { value: 'notes', label: 'Notes' },
  { value: 'invoices', label: 'Invoices' },
];

function TextOnlyExample() {
  const [value, setValue] = useState('overview');

  return (
    <Segmented aria-label="Record sections" onValueChange={setValue} value={value}>
      {TEXT_ITEMS.map((item) => (
        <SegmentedItem key={item.value} value={item.value}>
          {item.label}
        </SegmentedItem>
      ))}
    </Segmented>
  );
}

function IconsAndBadgesExample() {
  const [value, setValue] = useState('profile');

  return (
    <Segmented aria-label="Account sections" onValueChange={setValue} value={value}>
      <SegmentedItem leftIcon={<UserIcon aria-hidden weight="light" />} value="profile">
        Profile
      </SegmentedItem>
      <SegmentedItem
        badge={2}
        leftIcon={<FilesIcon aria-hidden weight="light" />}
        value="documents"
      >
        Documents
      </SegmentedItem>
      <SegmentedItem
        badge={20}
        leftIcon={<WarningIcon aria-hidden weight="light" />}
        value="reports"
      >
        Reports
      </SegmentedItem>
    </Segmented>
  );
}

export function SegmentedDemo() {
  return (
    <ComponentSection
      description="Segmented buttons help people select options, switch views, or sort elements."
      id="segmented"
      title="Segmented"
    >
      <Example
        description="Default, hover, and active. Optional icon slot and count badge."
        title="Item states"
      >
        <div className="flex w-full flex-col gap-[28px] rounded-[8px] bg-bg-canvas p-[24px]">
          {ITEM_STATES.map(({ interaction, label }) => (
            <div key={interaction} className="flex items-center gap-[24px]">
              <span className="w-[72px] font-mono text-[16px] text-[#7B61FF] dark:text-[#a99bff]">
                {label}
              </span>
              <SegmentedItem
                badge={24}
                interaction={interaction}
                leftIcon={<ImageSquareIcon aria-hidden weight="light" />}
              >
                Products
              </SegmentedItem>
            </div>
          ))}
        </div>
      </Example>

      <Example description="Text-only items. One segment is selected at a time." title="Text only">
        <TextOnlyExample />
      </Example>

      <Example
        description="Icon slot and count badge, matching the Figma examples."
        title="With icons and badges"
      >
        <IconsAndBadgesExample />
      </Example>
    </ComponentSection>
  );
}
