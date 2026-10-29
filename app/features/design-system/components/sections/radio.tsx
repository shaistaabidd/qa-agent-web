import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Radio, RadioGroup } from '@/shared/ui/radio';
import type { RadioCheck, RadioInteraction } from '@/shared/ui/radio/types';
import { getPreviewControlClassName } from '@/shared/ui/radio/utils';

const CHECKS: { check: RadioCheck; label: string }[] = [
  { check: 'off', label: 'Default' },
  { check: 'on', label: 'Checked' },
];

const INTERACTIONS: { interaction: RadioInteraction; label: string }[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
  { interaction: 'pressed', label: 'Pressed' },
];

function PreviewControl({
  check,
  interaction,
}: {
  check: RadioCheck;
  interaction: RadioInteraction;
}) {
  return (
    <span
      className={getPreviewControlClassName(check, interaction)}
      data-check={check}
      data-slot="radio-control"
    />
  );
}

export function RadioSection() {
  return (
    <ComponentSection
      id="radio"
      title="Radio"
      description="When a user can select only one option in a form."
    >
      <Example
        title="Radio Item states"
        description="Default, hover, and pressed across unselected and selected."
        contentClassName="overflow-visible"
      >
        <div className="grid grid-cols-[auto_repeat(2,minmax(0,2.5rem))] items-center gap-x-6 gap-y-6">
          <span />
          {CHECKS.map(({ check, label }) => (
            <span
              key={check}
              className="text-center font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]"
            >
              {label}
            </span>
          ))}
          {INTERACTIONS.map(({ interaction, label }) => (
            <div key={interaction} className="contents">
              <span className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]">
                {label}
              </span>
              {CHECKS.map(({ check }) => (
                <span key={`${interaction}-${check}`} className="flex justify-center">
                  <PreviewControl check={check} interaction={interaction} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Example>

      <Example title="Interactive" description="Only one option can be selected in the group.">
        <RadioGroup defaultValue="checked" name="radio-interactive">
          <Radio value="unchecked">Unchecked</Radio>
          <Radio value="checked">Checked</Radio>
        </RadioGroup>
      </Example>

      <Example
        title="Placement"
        description="Label and helper sit in a column. Radio is 8px to the left or right, aligned with the label."
        contentClassName="items-start"
      >
        <Radio helperText="Helper text goes here" name="radio-placement-left">
          Label
        </Radio>
        <Radio helperText="Helper text goes here" name="radio-placement-right" placement="right">
          Label
        </Radio>
      </Example>

      <Example
        title="Disabled"
        description="Cursor is not-allowed. Unchecked uses the disabled surface. Selected keeps the primary ring."
      >
        <RadioGroup defaultValue="checked" disabled name="radio-disabled">
          <Radio value="unchecked">Unchecked</Radio>
          <Radio value="checked">Checked</Radio>
        </RadioGroup>
      </Example>

      <Example title="Error" description="Invalid state on the control, label, and helper.">
        <Radio error helperText="Helper text goes here" name="radio-error">
          Label
        </Radio>
      </Example>
    </ComponentSection>
  );
}
