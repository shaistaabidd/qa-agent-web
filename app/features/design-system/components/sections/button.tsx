import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple';
import { PlusIcon } from '@phosphor-icons/react/Plus';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { Link } from 'react-router';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';

const VARIANTS = ['default', 'outline', 'ghost', 'link', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg', 'xl'] as const;
const ICON_SIZES = ['icon-sm', 'icon-md', 'icon-lg', 'icon-xl'] as const;

const VARIANT_LABELS = {
  default: 'Default',
  outline: 'Outline',
  ghost: 'Ghost',
  link: 'Link',
  danger: 'Danger',
} as const;

export function ButtonSection() {
  return (
    <ComponentSection
      id="button"
      title="Button"
      description="SaaS Temp button with Figma types (default, outline, ghost, link, danger), sizes, icon slots, and icon-only variants. Icons use Phosphor Light."
    >
      <Example title="Variants">
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {VARIANT_LABELS[variant]}
          </Button>
        ))}
      </Example>

      <Example
        title="Sizes"
        description="sm, md, lg, xl. Default size is xl (16px × 12px padding)."
      >
        {SIZES.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </Example>

      <Example title="Disabled">
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant} disabled>
            {VARIANT_LABELS[variant]}
          </Button>
        ))}
      </Example>

      <Example
        title="With icons"
        description="leftIcon and rightIcon slots. Phosphor Plus and CaretDown at Light weight."
      >
        <Button
          leftIcon={<PlusIcon aria-hidden weight="light" />}
          rightIcon={<CaretDownIcon aria-hidden weight="light" />}
        >
          Label
        </Button>
        <Button variant="outline" leftIcon={<EnvelopeSimpleIcon aria-hidden weight="light" />}>
          Send email
        </Button>
        <Button variant="danger" leftIcon={<TrashIcon aria-hidden weight="light" />}>
          Delete
        </Button>
      </Example>

      <Example title="Icon" description="Fixed square icon buttons from the Icon Button set.">
        {ICON_SIZES.map((size) => (
          <Button key={size} size={size} aria-label="Add">
            <PlusIcon aria-hidden weight="light" />
          </Button>
        ))}
      </Example>

      <Example title="As child" description="Renders this app's router Link, styled as a button.">
        <Button asChild>
          <Link to="/design-system">Go to design system</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/design-system">Outline link</Link>
        </Button>
      </Example>
    </ComponentSection>
  );
}
