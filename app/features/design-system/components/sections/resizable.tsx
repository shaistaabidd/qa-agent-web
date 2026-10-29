import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/shared/ui/resizable';

export function ResizableSection() {
  return (
    <ComponentSection
      description="Split panes with a draggable handle."
      id="resizable"
      title="Resizable"
    >
      <Example contentClassName="block h-[180px] w-full max-w-[480px] p-0" title="Horizontal">
        <ResizablePanelGroup
          className="rounded-[12px] border border-subtle"
          orientation="horizontal"
        >
          <ResizablePanel defaultSize="50%">
            <div className="flex h-full items-center justify-center text-sm text-fg-secondary">
              Left
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="50%">
            <div className="flex h-full items-center justify-center text-sm text-fg-secondary">
              Right
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Example>
    </ComponentSection>
  );
}
