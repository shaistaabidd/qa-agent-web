import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { AspectRatio } from '@/shared/ui/aspect-ratio';

export function AspectRatioSection() {
  return (
    <ComponentSection
      description="Locks content to a fixed aspect ratio."
      id="aspect-ratio"
      title="Aspect Ratio"
    >
      <Example contentClassName="block w-full max-w-[280px]" title="16:9">
        <AspectRatio className="overflow-hidden rounded-[12px] bg-bg-muted" ratio={16 / 9}>
          <div className="flex size-full items-center justify-center text-sm text-fg-secondary">
            16:9
          </div>
        </AspectRatio>
      </Example>
    </ComponentSection>
  );
}
