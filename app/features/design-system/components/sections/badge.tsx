import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Badge } from '@/shared/ui/badge';

const VARIANTS = [
  'neutral',
  'primary',
  'primary-light',
  'rosy',
  'info',
  'info-light',
  'error',
  'error-light',
] as const;

export function BadgeSection() {
  return (
    <ComponentSection
      id="badge"
      title="Badge"
      description="Count badges for numeric labels and a status dot. Types match the Figma Badge set."
    >
      <Example
        title="Count"
        description="neutral, primary, primary-light, rosy, info, info-light, error, error-light."
      >
        {VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            24
          </Badge>
        ))}
      </Example>

      <Example title="Dot">
        {VARIANTS.map((variant) => (
          <Badge key={variant} dot variant={variant} />
        ))}
      </Example>
    </ComponentSection>
  );
}
