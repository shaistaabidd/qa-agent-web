import { ComponentSection, Example } from '@/features/design-system/components/Showcase';

import { ColorScale } from './ColorScale';
import { ColorSwatch } from './ColorSwatch';
import { BASE_SWATCHES, PRIMITIVE_SCALES, SEMANTIC_GROUPS } from './constants';

export function ColorsSection() {
  return (
    <ComponentSection
      id="colors"
      title="Colors"
      description="Primitive ramps and semantic tokens from the Figma color styles. Use utilities such as text-fg-default, bg-bg-raised, and border-subtle."
    >
      <Example
        title="Scales"
        description="Brand, slate, blue, green, red, yellow, rosy, and amber. Brand includes 25."
        contentClassName="w-full flex-col items-stretch gap-6"
      >
        {PRIMITIVE_SCALES.map((item) => (
          <ColorScale key={item.prefix} {...item} />
        ))}
      </Example>

      <Example
        title="Base"
        description="White and black."
        contentClassName="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6"
      >
        {BASE_SWATCHES.map((swatch) => (
          <ColorSwatch key={swatch.token} {...swatch} />
        ))}
      </Example>

      {SEMANTIC_GROUPS.map((group) => (
        <Example
          key={group.title}
          title={group.title}
          description={group.description}
          contentClassName="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {group.swatches.map((swatch) => (
            <ColorSwatch key={swatch.token} {...swatch} />
          ))}
        </Example>
      ))}
    </ComponentSection>
  );
}
