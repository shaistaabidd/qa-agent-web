import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Tag, TAG_SIZES, TAG_VARIANTS } from '@/shared/ui/tag';

function TypesExample({ showDot }: { showDot: boolean }) {
  return (
    <div className="flex flex-col gap-[16px]">
      {TAG_SIZES.map((size) => (
        <div className="flex flex-wrap items-center gap-[16px]" key={size}>
          {TAG_VARIANTS.map((variant) => (
            <Tag key={variant} showDot={showDot} size={size} variant={variant}>
              Label
            </Tag>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TagSection() {
  return (
    <ComponentSection description="Used to show status." id="tag" title="Tag">
      <Example
        contentClassName="block"
        description="Default, success, error, warning, info, and custom. Small uses 12px type; large uses 14px."
        title="Types"
      >
        <TypesExample showDot />
      </Example>

      <Example
        contentClassName="block"
        description="The status dot can be hidden when the color alone is enough."
        title="Without dot"
      >
        <TypesExample showDot={false} />
      </Example>
    </ComponentSection>
  );
}
