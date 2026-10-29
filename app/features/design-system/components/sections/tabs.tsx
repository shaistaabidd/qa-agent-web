import { CalendarDotsIcon } from '@phosphor-icons/react/CalendarDots';
import { ImageSquareIcon } from '@phosphor-icons/react/ImageSquare';
import { KanbanIcon } from '@phosphor-icons/react/Kanban';
import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { TabItem, TabPanel, Tabs } from '@/shared/ui/tabs';
import type { TabItemInteraction } from '@/shared/ui/tabs/types';

const ITEM_STATES: { interaction: TabItemInteraction; label: string }[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
  { interaction: 'active', label: 'Active' },
  { interaction: 'active-hover', label: 'Active Hover' },
];

function IconsExample() {
  const [value, setValue] = useState('board');

  return (
    <div>
      <Tabs aria-label="View" id="view-tabs" onValueChange={setValue} value={value}>
        <TabItem leftIcon={<CalendarDotsIcon aria-hidden weight="light" />} value="calendar">
          Calendar
        </TabItem>
        <TabItem leftIcon={<KanbanIcon aria-hidden weight="light" />} value="board">
          Board
        </TabItem>
        <TabItem leftIcon={<ImageSquareIcon aria-hidden weight="light" />} value="timeline">
          Timeline
        </TabItem>
      </Tabs>
      <TabPanel className="pt-[12px]" tabsId="view-tabs" value={value}>
        {value} content
      </TabPanel>
    </div>
  );
}

function TextOnlyExample() {
  const [value, setValue] = useState('products');

  return (
    <div>
      <Tabs aria-label="Catalog" id="catalog-tabs" onValueChange={setValue} value={value}>
        <TabItem value="products">Products</TabItem>
        <TabItem value="orders">Orders</TabItem>
        <TabItem value="settings">Settings</TabItem>
      </Tabs>
      <TabPanel className="pt-[12px]" tabsId="catalog-tabs" value={value}>
        {value} content
      </TabPanel>
    </div>
  );
}

function BadgesExample() {
  const [value, setValue] = useState('active');

  return (
    <div>
      <Tabs aria-label="Status" id="status-tabs" fullWidth onValueChange={setValue} value={value}>
        <TabItem badge={24} value="active">
          Active
        </TabItem>
        <TabItem badge="90k" value="in-progress">
          In Progress
        </TabItem>
        <TabItem badge="109k" value="completed">
          Completed
        </TabItem>
      </Tabs>
      <TabPanel className="pt-[12px]" tabsId="status-tabs" value={value}>
        {value} content
      </TabPanel>
    </div>
  );
}

export function TabsDemo() {
  return (
    <ComponentSection
      description="A set of layered sections of content—known as tab panels—that are displayed one at a time."
      id="tabs"
      title="Tabs"
    >
      <Example
        description="Default, hover, active, and active hover. Optional icon slot and count badge."
        title="Item states"
      >
        <div className="flex w-full flex-col gap-[24px]">
          {ITEM_STATES.map(({ interaction, label }) => (
            <div key={interaction} className="flex items-center gap-[24px]">
              <span className="w-[118px] font-mono text-[16px] text-[#7B61FF] dark:text-[#a99bff]">
                {label}
              </span>
              <div className="border-b border-subtle">
                <TabItem
                  badge={24}
                  interaction={interaction}
                  leftIcon={<ImageSquareIcon aria-hidden weight="light" />}
                >
                  Products
                </TabItem>
              </div>
            </div>
          ))}
        </div>
      </Example>

      <Example
        description="Icon on the left. The active tab uses a 2px primary underline."
        title="With icons"
      >
        <IconsExample />
      </Example>

      <Example description="Text-only tabs." title="Text only">
        <TextOnlyExample />
      </Example>

      <Example
        contentClassName="w-full"
        description="Equal-width tabs with count badges. Active uses the primary badge."
        title="Full width with badges"
      >
        <BadgesExample />
      </Example>
    </ComponentSection>
  );
}
