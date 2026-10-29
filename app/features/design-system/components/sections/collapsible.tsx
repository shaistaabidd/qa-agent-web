import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';

export function CollapsibleSection() {
  return (
    <ComponentSection
      description="Show and hide content with a trigger."
      id="collapsible"
      title="Collapsible"
    >
      <Example contentClassName="block w-full max-w-[360px]" title="Basic">
        <Collapsible className="space-y-[8px]">
          <CollapsibleTrigger asChild>
            <Button variant="outline">Toggle details</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="rounded-[8px] border border-subtle p-[12px] text-sm text-fg-secondary">
            Hidden content revealed when open.
          </CollapsibleContent>
        </Collapsible>
      </Example>
    </ComponentSection>
  );
}
