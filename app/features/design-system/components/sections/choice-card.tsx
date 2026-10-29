import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { ChoiceCard } from '@/shared/ui/choice-card';
import type {
  ChoiceCardInteraction,
  ChoiceCardSize,
  ChoiceCardType,
} from '@/shared/ui/choice-card/types';
import { RadioGroup } from '@/shared/ui/radio';

const TYPES: { type: ChoiceCardType; label: string }[] = [
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'radio', label: 'Radio' },
  { type: 'switch', label: 'Switch' },
];

const STATES: {
  checked?: boolean;
  interaction: ChoiceCardInteraction;
  label: string;
}[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
  { checked: true, interaction: 'default', label: 'Selected' },
];

function PreviewCard({
  checked,
  interaction,
  size,
  type,
}: {
  checked?: boolean;
  interaction: ChoiceCardInteraction;
  size: ChoiceCardSize;
  type: ChoiceCardType;
}) {
  return (
    <ChoiceCard
      checked={checked}
      className="w-full min-w-0"
      helperText="Helper text goes here"
      interaction={interaction}
      size={size}
      type={type}
    >
      Label
    </ChoiceCard>
  );
}

function StateMatrix({ size }: { size: ChoiceCardSize }) {
  return (
    <div className="grid w-full min-w-0 grid-cols-[auto_repeat(3,minmax(0,360px))] items-center gap-x-6 gap-y-6">
      <span />
      {STATES.map(({ label }) => (
        <span
          key={`${size}-${label}`}
          className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]"
        >
          {label}
        </span>
      ))}
      {TYPES.map(({ type, label }) => (
        <div key={`${size}-${type}`} className="contents">
          <span className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]">{label}</span>
          {STATES.map((state) => (
            <PreviewCard
              key={`${size}-${type}-${state.label}`}
              checked={state.checked}
              interaction={state.interaction}
              size={size}
              type={type}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChoiceCardSection() {
  return (
    <ComponentSection
      id="choice-card"
      title="Choice Card"
      description="Card-style selection where the form element is wrapped in a card like structure. The entire card is clickable."
    >
      <Example title="Large" description="12px radius and 10px vertical padding.">
        <StateMatrix size="large" />
      </Example>

      <Example title="Medium" description="8px radius and 8px vertical padding.">
        <StateMatrix size="medium" />
      </Example>

      <Example
        title="Interactive"
        description="Click anywhere on the card to toggle. Selected uses the primary border and fill."
        contentClassName="items-start"
      >
        <ChoiceCard className="w-[360px]" helperText="Helper text goes here" type="checkbox">
          Label
        </ChoiceCard>
        <ChoiceCard className="w-[360px]" helperText="Helper text goes here" type="switch">
          Label
        </ChoiceCard>
        <RadioGroup className="flex w-[360px] flex-col gap-[8px]">
          <ChoiceCard helperText="Helper text goes here" type="radio" value="one">
            Label
          </ChoiceCard>
          <ChoiceCard helperText="Helper text goes here" type="radio" value="two">
            Label
          </ChoiceCard>
        </RadioGroup>
      </Example>

      <Example
        title="Without helper text"
        description="Omit helperText to show only the label and control."
        contentClassName="items-start"
      >
        <ChoiceCard className="w-[360px]" type="checkbox">
          Label
        </ChoiceCard>
        <ChoiceCard className="w-[360px]" type="switch">
          Label
        </ChoiceCard>
        <ChoiceCard className="w-[360px]" type="radio">
          Label
        </ChoiceCard>
      </Example>
    </ComponentSection>
  );
}
