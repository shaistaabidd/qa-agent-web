import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVerticalIcon } from '@phosphor-icons/react/DotsSixVertical';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

type SortableItemProps = {
  id: string;
  label: string;
  children: ReactNode;
  disabled?: boolean;
};

function SortableItem({ id, label, children, disabled = false }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        'flex items-center gap-[8px] rounded-[8px] bg-bg-raised',
        isDragging && 'opacity-50 shadow-popover',
      )}
      data-dragging={isDragging ? '' : undefined}
      data-slot="sortable-item"
      ref={setNodeRef}
      style={style}
    >
      <Button
        className={cn(
          'size-[24px] shrink-0 cursor-grab touch-none rounded-none border-0 bg-transparent p-0 text-fg-secondary hover:bg-transparent hover:text-fg-default active:cursor-grabbing active:bg-transparent',
          disabled && 'pointer-events-none opacity-50',
        )}
        type="button"
        variant="ghost"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${label}`}
      >
        <DotsSixVerticalIcon aria-hidden className="size-[16px]" weight="bold" />
      </Button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export { SortableItem };
export type { SortableItemProps };
