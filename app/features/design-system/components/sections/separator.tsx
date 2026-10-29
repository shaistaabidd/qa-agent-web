import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Separator } from '@/shared/ui/separator';
import { Typography } from '@/shared/ui/Typography';

export function SeparatorSection() {
  return (
    <ComponentSection
      description="Radix separator for horizontal or vertical rules."
      id="separator"
      title="Separator"
    >
      <Example contentClassName="block" title="Horizontal">
        <div className="space-y-[12px]">
          <Typography variant="body3">Above</Typography>
          <Separator />
          <Typography variant="body3">Below</Typography>
        </div>
      </Example>
      <Example title="Vertical">
        <div className="flex h-[48px] items-center gap-[12px]">
          <Typography variant="body3">Blog</Typography>
          <Separator orientation="vertical" />
          <Typography variant="body3">Docs</Typography>
        </div>
      </Example>
    </ComponentSection>
  );
}
