import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Banner } from '@/shared/ui/banner';
import { Button } from '@/shared/ui/button';

const VARIANTS = ['info', 'warning', 'error', 'success'] as const;

function DismissibleBanner() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm" variant="outline">
        Show banner
      </Button>
    );
  }

  return (
    <Banner
      action="Action"
      onClose={() => setOpen(false)}
      role="none"
      title="Title"
      variant="info"
    />
  );
}

export function BannerSection() {
  return (
    <ComponentSection
      description="A colorful UI element to grab the user attention for the time being."
      id="banner"
      title="Banner"
    >
      <Example
        contentClassName="flex w-full flex-col items-stretch overflow-hidden p-0"
        description="Info, warning, error, and success."
        title="Types"
      >
        {VARIANTS.map((variant) => (
          <Banner action="Action" key={variant} role="none" title="Title" variant={variant} />
        ))}
      </Example>

      <Example
        contentClassName="flex w-full flex-col items-stretch overflow-hidden p-0"
        description="Supporting text uses the same size as the title."
        title="With supporting text"
      >
        <Banner
          action="Action"
          description="Supporting text"
          role="none"
          title="Title"
          variant="info"
        />
      </Example>

      <Example
        contentClassName="flex w-full flex-col items-stretch overflow-hidden p-0"
        description="Title only, without supporting text or actions."
        title="Title only"
      >
        <Banner role="none" title="Please fill the form" variant="info" />
      </Example>

      <Example
        contentClassName="flex w-full flex-col items-stretch overflow-hidden p-0"
        description="Close hides the banner. Show banner brings it back."
        title="Dismissible"
      >
        <DismissibleBanner />
      </Example>
    </ComponentSection>
  );
}
