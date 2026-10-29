import { Button } from '@/shared/ui/button';
import { Chip } from '@/shared/ui/chip';
import type { DropdownItemMeta } from '@/shared/ui/dropdown/types';

import { selectedListClass } from './constants';
import { useOpenChipLock } from './use-open-chip-lock';

export function ComboboxChips({
  disabled,
  items,
  lockHeight = false,
  onClearAll,
  onRemove,
  showClearAll = true,
}: {
  disabled?: boolean;
  items: DropdownItemMeta[];
  lockHeight?: boolean;
  onClearAll: () => void;
  onRemove: (value: string) => void;
  showClearAll?: boolean;
}) {
  const ref = useOpenChipLock(lockHeight);

  if (items.length === 0 && !lockHeight) {
    return null;
  }

  return (
    <div ref={ref}>
      {items.length > 0 ? (
        <div className={selectedListClass} data-slot="multi-select-chips">
          {items.map((item) => (
            <Chip
              disabled={disabled}
              key={item.value}
              onRemove={() => onRemove(item.value)}
              size="lg"
            >
              {item.label}
            </Chip>
          ))}
          {showClearAll && items.length > 1 ? (
            <Button
              aria-label="Clear all selected"
              className="text-fg-primary no-underline hover:text-fg-primary active:text-fg-primary"
              disabled={disabled}
              onClick={onClearAll}
              size="sm"
              variant="link"
            >
              Clear All
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
