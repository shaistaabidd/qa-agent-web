import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

export function PopoverSection() {
  return (
    <ComponentSection
      description="Floating content anchored to a trigger."
      id="popover"
      title="Popover"
    >
      <Example title="Basic">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="font-medium text-fg-default">Popover title</p>
            <p className="text-sm text-fg-secondary">Short supporting copy.</p>
          </PopoverContent>
        </Popover>
      </Example>
    </ComponentSection>
  );
}
