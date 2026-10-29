import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Kbd, KbdGroup } from '@/shared/ui/kbd';

export function KbdSection() {
  return (
    <ComponentSection
      description="Keyboard key labels for shortcuts and hints."
      id="kbd"
      title="Kbd"
    >
      <Example title="Keys">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
      </Example>
    </ComponentSection>
  );
}
