import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu';

export function ContextMenuSection() {
  return (
    <ComponentSection
      description="Contextual actions. Right-click, or focus the target and press Shift+F10."
      id="context-menu"
      title="Context Menu"
    >
      <Example contentClassName="block" title="Basic">
        <ContextMenu>
          <ContextMenuTrigger className="flex h-[120px] w-full items-center justify-center rounded-[8px] border border-dashed border-subtle text-sm text-fg-secondary">
            Right-click or press Shift+F10
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Open</ContextMenuItem>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Example>
    </ComponentSection>
  );
}
