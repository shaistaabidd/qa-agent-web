import {
  type Announcements,
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DotsSixVerticalIcon } from '@phosphor-icons/react/DotsSixVertical';
import { type ReactNode, useMemo, useSyncExternalStore } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

import { SortableKeyboardSensor } from './keyboard-sensor';
import { SortableItem } from './sortable-item';

type SortableRecord = {
  id: string;
  label: string;
};

type SortableListProps<T extends SortableRecord> = {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  disabled?: boolean;
};

function itemName(items: SortableRecord[], id: string | number) {
  return items.find((item) => item.id === id)?.label ?? String(id);
}

function announcementsFor(items: SortableRecord[]): Announcements {
  return {
    onDragStart({ active }) {
      return `Picked up ${itemName(items, active.id)}.`;
    },
    onDragOver({ active, over }) {
      const name = itemName(items, active.id);

      if (over) {
        return `${name} was moved over ${itemName(items, over.id)}.`;
      }

      return `${name} is no longer over a droppable area.`;
    },
    onDragEnd({ active, over }) {
      const name = itemName(items, active.id);

      if (over && over.id !== active.id) {
        return `${name} was dropped over ${itemName(items, over.id)}.`;
      }

      return `${name} was dropped.`;
    },
    onDragCancel({ active }) {
      return `Dragging was cancelled. ${itemName(items, active.id)} was dropped.`;
    },
  };
}

function subscribeNoop() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function SortableListShell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <ul className={cn('flex flex-col gap-[8px]', className)} data-slot="sortable-list">
      {children}
    </ul>
  );
}

function SortableItemPlaceholder({
  children,
  disabled,
  label,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
}) {
  return (
    <div
      className="flex items-center gap-[8px] rounded-[8px] bg-bg-raised"
      data-slot="sortable-item"
    >
      <Button
        aria-disabled={disabled || undefined}
        aria-label={`Drag to reorder ${label}`}
        className={cn(
          'size-[24px] shrink-0 touch-none rounded-none border-0 bg-transparent p-0 text-fg-secondary hover:bg-transparent active:bg-transparent',
          disabled ? 'pointer-events-none opacity-50' : 'cursor-grab opacity-50',
        )}
        disabled
        type="button"
        variant="ghost"
      >
        <DotsSixVerticalIcon aria-hidden className="size-[16px]" weight="bold" />
      </Button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function SortableList<T extends SortableRecord>({
  items,
  onReorder,
  renderItem,
  className,
  disabled = false,
}: SortableListProps<T>) {
  const mounted = useMounted();
  const announcements = useMemo(() => announcementsFor(items), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(SortableKeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  if (!mounted) {
    return (
      <SortableListShell className={className}>
        {items.map((item, index) => (
          <li key={item.id}>
            <SortableItemPlaceholder disabled={disabled} label={item.label}>
              {renderItem(item, index)}
            </SortableItemPlaceholder>
          </li>
        ))}
      </SortableListShell>
    );
  }

  return (
    <DndContext
      accessibility={{ announcements }}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <SortableListShell className={className}>
          {items.map((item, index) => (
            <li key={item.id}>
              <SortableItem disabled={disabled} id={item.id} label={item.label}>
                {renderItem(item, index)}
              </SortableItem>
            </li>
          ))}
        </SortableListShell>
      </SortableContext>
    </DndContext>
  );
}

export { SortableList };
export type { SortableListProps };
