import { ImageSquareIcon } from '@phosphor-icons/react/ImageSquare';
import { XIcon } from '@phosphor-icons/react/X';
import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Chip, CHIP_INTERACTIONS, CHIP_SIZES, CHIP_VARIANTS } from '@/shared/ui/chip';

function ChipAdornment() {
  return <ImageSquareIcon aria-hidden weight="light" />;
}

function ChipDismiss() {
  return <XIcon aria-hidden weight="light" />;
}

function StatesExample({ variant }: { variant: 'default' | 'input' }) {
  return (
    <div className="flex flex-col gap-[16px]">
      {CHIP_SIZES.map((size) => (
        <div className="flex flex-wrap items-center gap-[16px]" key={size}>
          {CHIP_INTERACTIONS.map((interaction) => (
            <Chip
              count={24}
              interaction={interaction}
              key={interaction}
              leftAdornment={<ChipAdornment />}
              rightIcon={<ChipDismiss />}
              size={size}
              variant={variant}
            >
              Label
            </Chip>
          ))}
        </div>
      ))}
    </div>
  );
}

function InteractiveExample() {
  const [selected, setSelected] = useState(['allergies', 'imaging']);
  const [inputChips, setInputChips] = useState(['Penicillin', 'MRI']);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <Chip
          count={12}
          leftAdornment={<ChipAdornment />}
          onClick={() => toggle('allergies')}
          selected={selected.includes('allergies')}
        >
          Allergies
        </Chip>
        <Chip
          count={4}
          leftAdornment={<ChipAdornment />}
          onClick={() => toggle('imaging')}
          selected={selected.includes('imaging')}
        >
          Imaging
        </Chip>
        <Chip
          leftAdornment={<ChipAdornment />}
          onClick={() => toggle('labs')}
          selected={selected.includes('labs')}
          size="lg"
        >
          Labs
        </Chip>
      </div>
      <div className="flex flex-wrap items-center gap-[8px]">
        {inputChips.map((chip) => (
          <Chip
            key={chip}
            leftAdornment={<ChipAdornment />}
            onRemove={() => setInputChips((current) => current.filter((value) => value !== chip))}
            variant="input"
          >
            {chip}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function ChipSection() {
  return (
    <ComponentSection
      description="Chips help people enter information, make selections, filter content, or trigger actions."
      id="chip"
      title="Chip"
    >
      {CHIP_VARIANTS.map((variant) => (
        <Example
          contentClassName="block"
          description={
            variant === 'input'
              ? 'Input chips start on a muted surface. Count badges stay primary until hover.'
              : 'Filter chips start on white. Count badges turn primary when selected.'
          }
          key={variant}
          title={variant === 'input' ? 'Input' : 'Default'}
        >
          <StatesExample variant={variant} />
        </Example>
      ))}

      <Example
        contentClassName="block"
        description="Click a filter chip to select it. Remove an input chip with the trailing control."
        title="Interactive"
      >
        <InteractiveExample />
      </Example>
    </ComponentSection>
  );
}
