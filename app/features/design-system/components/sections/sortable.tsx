import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { SortableList } from '@/shared/ui/sortable';
import { Typography } from '@/shared/ui/Typography';

const INITIAL = [
  { id: '1', label: 'Intake form' },
  { id: '2', label: 'Insurance card' },
  { id: '3', label: 'Invoice' },
];

export function SortableSection() {
  const [items, setItems] = useState(INITIAL);

  return (
    <ComponentSection description="Drag-and-drop reorderable list." id="sortable" title="Sortable">
      <Example contentClassName="block w-full max-w-[360px]" title="List">
        <SortableList
          items={items}
          onReorder={setItems}
          renderItem={(item) => (
            <Typography className="py-[8px]" variant="body3">
              {item.label}
            </Typography>
          )}
        />
      </Example>
    </ComponentSection>
  );
}
