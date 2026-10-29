import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { CopyInput } from '@/shared/ui/copy-input';

export function CopyInputSection() {
  const [value, setValue] = useState('https://safer.health/invite/abc123');

  return (
    <ComponentSection
      description="Read-only or editable input with a copy action."
      id="copy-input"
      title="Copy Input"
    >
      <Example contentClassName="block w-full max-w-[420px]" title="Default">
        <CopyInput aria-label="Invite link" value={value} />
      </Example>
      <Example contentClassName="block w-full max-w-[420px]" title="Editable">
        <CopyInput
          aria-label="Editable invite link"
          editable
          onValueChange={setValue}
          value={value}
        />
      </Example>
    </ComponentSection>
  );
}
