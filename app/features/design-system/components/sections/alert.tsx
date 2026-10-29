import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Alert, AlertAction, AlertClose, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';

const VARIANTS = ['info', 'warning', 'error', 'success'] as const;

// Catalog samples stay on the page, so they must not be assertive live regions.
const catalogRole = 'none' as const;

function DismissibleAlert() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm" variant="outline">
        Show alert
      </Button>
    );
  }

  return (
    <Alert role={catalogRole} variant="info">
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>Supporting text</AlertDescription>
      <AlertAction>
        <AlertClose onClick={() => setOpen(false)} />
      </AlertAction>
    </Alert>
  );
}

export function AlertSection() {
  return (
    <ComponentSection
      description="A colorful UI element to grab the user attention for the time being."
      id="alert"
      title="Alert"
    >
      <Example
        contentClassName="flex w-full flex-col items-stretch gap-[12px]"
        description="Info, warning, error, and success."
        title="Types"
      >
        {VARIANTS.map((variant) => (
          <Alert key={variant} role={catalogRole} variant={variant}>
            <AlertTitle>Title</AlertTitle>
            <AlertDescription>Supporting text</AlertDescription>
          </Alert>
        ))}
      </Example>

      <Example
        contentClassName="flex w-full flex-col items-stretch gap-[12px]"
        description="Optional action sits in AlertAction."
        title="With action"
      >
        <Alert role={catalogRole} variant="info">
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Supporting text</AlertDescription>
          <AlertAction>
            <Button size="sm" variant="link">
              Action
            </Button>
          </AlertAction>
        </Alert>
      </Example>

      <Example
        contentClassName="flex w-full flex-col items-stretch gap-[12px]"
        description="Title only, without supporting text or actions."
        title="Title only"
      >
        <Alert role={catalogRole} variant="info">
          <AlertTitle>Please fill the form</AlertTitle>
        </Alert>
      </Example>

      <Example
        contentClassName="flex w-full flex-col items-stretch gap-[12px]"
        description="Close hides the alert. Show alert brings it back."
        title="Dismissible"
      >
        <DismissibleAlert />
      </Example>
    </ComponentSection>
  );
}
