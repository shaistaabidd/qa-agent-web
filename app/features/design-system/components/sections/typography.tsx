import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Typography } from '@/shared/ui/Typography';

const HEADING_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
const HEADING_SIZES = {
  h1: { base: '3xl', md: '5xl', lg: '6xl' },
  h2: { base: '2xl', md: '4xl', lg: '5xl' },
  h3: { base: '2xl', md: '3xl', lg: '4xl' },
  h4: { base: 'xl', md: '2xl', lg: '3xl' },
  h5: { base: 'lg', md: 'xl', lg: '2xl' },
  h6: { base: 'base', md: 'lg', lg: 'xl' },
} as const;
const BODY_VARIANTS = ['body1', 'body2', 'body3'] as const;
const WEIGHTS = ['regular', 'medium', 'semibold', 'bold'] as const;
const TEXT_COLORS = ['text-fg-default', 'text-fg-secondary', 'text-fg-primary'] as const;

export function TypographySection() {
  return (
    <ComponentSection
      id="typography"
      title="Typography"
      description="Inter text styles for headings, body, caption, and footer. Size and weight come from Figma tokens. Color is not set by the component — pair with a text token such as text-fg-default."
    >
      <Example
        title="Headings"
        description="variant h1–h6 with size breakpoints. base is mobile, md tablet, lg desktop."
      >
        <div className="w-full space-y-4">
          {HEADING_VARIANTS.map((variant) => (
            <Typography key={variant} variant={variant} size={HEADING_SIZES[variant]}>
              {`Heading ${variant.slice(1)}`}
            </Typography>
          ))}
        </div>
      </Example>

      <Example title="Body" description="variant body1, body2, body3. Default weight is regular.">
        <div className="w-full space-y-3">
          {BODY_VARIANTS.map((variant) => (
            <Typography key={variant} variant={variant}>
              {variant} — SaaS Temp helps teams get work done.
            </Typography>
          ))}
        </div>
      </Example>

      <Example title="Caption & Footer" description="variant caption, footer">
        <div className="w-full space-y-3">
          <Typography variant="caption" as="p" className="text-medium">
            Caption text for supporting details.
          </Typography>
          <Typography variant="footer" className="text-medium">
            Footer text for legal or meta copy.
          </Typography>
        </div>
      </Example>

      <Example title="Weights" description="regular, medium, semibold, bold">
        <div className="w-full space-y-3">
          {WEIGHTS.map((fontWeight) => (
            <Typography key={fontWeight} variant="body1" fontWeight={fontWeight}>
              {fontWeight}
            </Typography>
          ))}
        </div>
      </Example>

      <Example title="Color" description="Semantic text tokens via className">
        <div className="w-full space-y-3">
          {TEXT_COLORS.map((className) => (
            <Typography key={className} variant="body2" className={className}>
              {className}
            </Typography>
          ))}
        </div>
      </Example>
    </ComponentSection>
  );
}
