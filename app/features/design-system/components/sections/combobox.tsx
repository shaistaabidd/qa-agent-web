import { useId, useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { cn } from '@/shared/lib/utils';
import { Combobox, ComboboxGroup, ComboboxItem } from '@/shared/ui/combobox';
import { Label } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/Typography';

const PEOPLE = {
  design: [
    { initials: 'J', name: 'Jane Miller', value: 'jane-miller' },
    { initials: 'J', name: 'John Doe', value: 'john-doe' },
  ],
  engineering: [{ initials: 'J', name: 'John Xylo', tone: 'brand' as const, value: 'john-xylo' }],
};

const STATES = [
  { value: 'texas', label: 'Texas' },
  { value: 'california', label: 'California' },
  { value: 'florida', label: 'Florida' },
  { value: 'new-york', label: 'New York' },
];

function LetterAvatar({
  children,
  tone = 'neutral',
}: {
  children: string;
  tone?: 'brand' | 'neutral';
}) {
  return (
    <span
      className={cn(
        'flex size-full items-center justify-center rounded-full',
        tone === 'brand' ? 'bg-bg-primary-subtle' : 'bg-bg-muted',
      )}
    >
      <Typography
        as="span"
        className={tone === 'brand' ? 'text-fg-primary' : 'text-fg-default'}
        fontWeight="semibold"
        variant="body3"
      >
        {children}
      </Typography>
    </span>
  );
}

function TeamField() {
  const id = useId();
  const [value, setValue] = useState('jane-miller');

  return (
    <div className="flex w-full max-w-[425px] flex-col gap-[8px]">
      <Label htmlFor={id}>Assign to</Label>
      <Combobox id={id} onValueChange={setValue} value={value}>
        <ComboboxGroup label="Design team (Your workspace)">
          {PEOPLE.design.map((person) => (
            <ComboboxItem
              key={person.value}
              leftIcon={<LetterAvatar>{person.initials}</LetterAvatar>}
              value={person.value}
            >
              {person.name}
            </ComboboxItem>
          ))}
        </ComboboxGroup>
        <ComboboxGroup label="Engineering team">
          {PEOPLE.engineering.map((person) => (
            <ComboboxItem
              key={person.value}
              leftIcon={<LetterAvatar tone={person.tone}>{person.initials}</LetterAvatar>}
              value={person.value}
            >
              {person.name}
            </ComboboxItem>
          ))}
        </ComboboxGroup>
      </Combobox>
    </div>
  );
}

function StateField() {
  const id = useId();
  const [value, setValue] = useState('texas');

  return (
    <div className="flex w-full max-w-[360px] flex-col gap-[8px]">
      <Label htmlFor={id}>State</Label>
      <Combobox id={id} onValueChange={setValue} value={value}>
        {STATES.map((state) => (
          <ComboboxItem key={state.value} value={state.value}>
            {state.label}
          </ComboboxItem>
        ))}
      </Combobox>
    </div>
  );
}

export function ComboboxDemo() {
  return (
    <ComponentSection
      description="A searchable select. Search lives at the top of the menu, with optional group headers for related options."
      id="combobox"
      title="Combobox"
    >
      <Example
        description="Grouped people list with in-menu search, matching the select / combobox menu."
        title="With search and groups"
      >
        <TeamField />
      </Example>
      <Example
        description="Same trigger as Dropdown, with type-to-filter inside the menu."
        title="Simple search"
      >
        <StateField />
      </Example>
    </ComponentSection>
  );
}
