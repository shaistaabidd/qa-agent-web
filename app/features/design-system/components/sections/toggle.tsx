import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Toggle } from '@/shared/ui/toggle';

export function ToggleSection() {
  return (
    <ComponentSection
      description="Pressed/unpressed control for binary UI state."
      id="toggle"
      title="Toggle"
    >
      <Example title="Variants">
        <Toggle aria-label="Bold" defaultPressed>
          Bold
        </Toggle>
        <Toggle aria-label="Italic" variant="outline">
          Italic
        </Toggle>
        <Toggle aria-label="Small" size="sm" variant="outline">
          Small
        </Toggle>
      </Example>
    </ComponentSection>
  );
}
