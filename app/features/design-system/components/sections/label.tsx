import type { ReactNode } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Label, type LabelDirection } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/Typography';

const DESCRIPTION = 'Description text';

function LabelSet({
  bold = false,
  direction = 'vertical',
}: {
  bold?: boolean;
  direction?: LabelDirection;
}) {
  const className = direction === 'horizontal' ? 'w-[232px]' : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Label bold={bold} className={className} description={DESCRIPTION} direction={direction} hint>
        Label
      </Label>
      <Label
        bold={bold}
        className={className}
        description={DESCRIPTION}
        direction={direction}
        hint
        required
      >
        Label
      </Label>
      <Label
        bold={bold}
        className={className}
        description={DESCRIPTION}
        direction={direction}
        hint
        optional
      >
        Label
      </Label>
    </div>
  );
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <Typography variant="caption" className="text-fg-secondary">
        {title}
      </Typography>
      {children}
    </div>
  );
}

export function LabelSection() {
  return (
    <ComponentSection
      id="label"
      title="Label"
      description="Form label from the Figma set: default, required, and optional, with bold or regular weight, stacked or horizontal."
    >
      <Example
        title="Default"
        description="Bold Label true and false. Hint icon and description are shown."
        contentClassName="items-start gap-16"
      >
        <Column title="Bold Label=True">
          <LabelSet bold />
        </Column>
        <Column title="Bold Label=False">
          <LabelSet />
        </Column>
      </Example>

      <Example
        title="Horizontal"
        description="Label row and description sit on one line."
        contentClassName="items-start gap-16"
      >
        <Column title="Bold Label=True">
          <LabelSet bold direction="horizontal" />
        </Column>
        <Column title="Bold Label=False">
          <LabelSet direction="horizontal" />
        </Column>
      </Example>
    </ComponentSection>
  );
}
