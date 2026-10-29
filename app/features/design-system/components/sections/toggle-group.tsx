import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group';

export function ToggleGroupSection() {
  return (
    <ComponentSection
      description="Group of toggles for single or multiple selection."
      id="toggle-group"
      title="Toggle Group"
    >
      <Example title="Single">
        <ToggleGroup
          aria-label="Text alignment"
          defaultValue="left"
          type="single"
          variant="outline"
        >
          <ToggleGroupItem aria-label="Left" value="left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Center" value="center">
            Center
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Right" value="right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
      </Example>
      <Example title="Connected">
        <ToggleGroup
          aria-label="Connected text alignment"
          defaultValue="left"
          spacing={0}
          type="single"
          variant="outline"
        >
          <ToggleGroupItem aria-label="Left" value="left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Center" value="center">
            Center
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Right" value="right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
      </Example>
    </ComponentSection>
  );
}
