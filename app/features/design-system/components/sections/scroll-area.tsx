import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { ScrollArea } from '@/shared/ui/scroll-area';

export function ScrollAreaSection() {
  return (
    <ComponentSection
      description="Radix scroll area with branded scrollbar thumb."
      id="scroll-area"
      title="Scroll Area"
    >
      <Example contentClassName="block" title="Vertical">
        <ScrollArea className="h-[160px] w-full max-w-[280px] rounded-[8px] border border-subtle p-[12px]">
          <div className="space-y-[8px] pr-[8px] text-sm text-fg-secondary">
            {Array.from({ length: 16 }, (_, i) => (
              <p key={i}>Scrollable row {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      </Example>
    </ComponentSection>
  );
}
