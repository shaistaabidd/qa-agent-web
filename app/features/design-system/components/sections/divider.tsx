import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Divider } from '@/shared/ui/divider';
import { Typography } from '@/shared/ui/Typography';

export function DividerSection() {
  return (
    <ComponentSection
      description="A container with horizontal or vertical line to create separation."
      id="divider"
      title="Divider"
    >
      <Example
        contentClassName="block"
        description="Vertical=False. Full-width 1px line using border-subtle."
        title="Horizontal"
      >
        <div className="space-y-0">
          <Typography variant="body3" fontWeight="medium">
            Section one
          </Typography>
          <Typography variant="caption" className="text-fg-secondary">
            Content above the divider.
          </Typography>
          <Divider />
          <Typography variant="body3" fontWeight="medium">
            Section two
          </Typography>
          <Typography variant="caption" className="text-fg-secondary">
            Content below the divider.
          </Typography>
        </div>
      </Example>

      <Example
        description="Vertical=True. Stretches to the row height with 12px inset."
        title="Vertical"
      >
        <div className="flex h-[83px] items-center">
          <Typography variant="body3">Blog</Typography>
          <Divider orientation="vertical" />
          <Typography variant="body3">Docs</Typography>
          <Divider orientation="vertical" />
          <Typography variant="body3">Source</Typography>
        </div>
      </Example>
    </ComponentSection>
  );
}
