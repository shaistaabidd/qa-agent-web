import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Checkbox } from '@/shared/ui/checkbox';
import { CheckboxGlyph } from '@/shared/ui/checkbox/checkbox-icons';
import type {
  CheckboxCheck,
  CheckboxChecked,
  CheckboxInteraction,
} from '@/shared/ui/checkbox/types';
import { getPreviewControlClassName } from '@/shared/ui/checkbox/utils';

const CHECKS: { check: CheckboxCheck; label: string }[] = [
  { check: 'off', label: 'Default' },
  { check: 'indeterminate', label: 'Inter' },
  { check: 'checked', label: 'Checked' },
];

const INTERACTIONS: { interaction: CheckboxInteraction; label: string }[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
  { interaction: 'pressed', label: 'Pressed' },
];

function PreviewControl({
  check,
  interaction,
}: {
  check: CheckboxCheck;
  interaction: CheckboxInteraction;
}) {
  return (
    <span
      className={getPreviewControlClassName(check, interaction)}
      data-check={check}
      data-slot="checkbox-control"
    >
      <CheckboxGlyph check={check} />
    </span>
  );
}

function IndeterminateExample() {
  const [checked, setChecked] = useState<CheckboxChecked>('indeterminate');

  return (
    <Checkbox
      checked={checked}
      id="checkbox-indeterminate"
      onCheckedChange={(next) => setChecked(next)}
    >
      Indeterminate
    </Checkbox>
  );
}

export function CheckboxSection() {
  return (
    <ComponentSection
      id="checkbox"
      title="Checkbox"
      description="When a user can select multiple options in a form. Can be used in place of a switch as well."
    >
      <Example
        title="Checkbox Item states"
        description="Default, hover, and pressed across unchecked, indeterminate, and checked."
        contentClassName="overflow-visible"
      >
        <div className="grid grid-cols-[auto_repeat(3,minmax(0,2.5rem))] items-center gap-x-6 gap-y-6">
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

      <Example
        title="Interactive"
        description="Unchecked and checked toggle on click. Indeterminate is a mixed state — click it to check, then uncheck as usual."
      >
        <Checkbox id="checkbox-unchecked">Unchecked</Checkbox>
        <Checkbox id="checkbox-checked" defaultChecked>
          Checked
        </Checkbox>
        <IndeterminateExample />
      </Example>

      <Example
        title="Placement"
        description="Label and helper sit in a column. Checkbox is 8px to the left or right, aligned with the label."
        contentClassName="items-start"
      >
        <Checkbox helperText="Helper text goes here">Label</Checkbox>
        <Checkbox helperText="Helper text goes here" placement="right">
          Label
        </Checkbox>
      </Example>

      <Example
        title="Disabled"
        description="Cursor is not-allowed. Unchecked uses the disabled surface. Checked keeps primary green and a white tick."
      >
        <Checkbox disabled>Unchecked</Checkbox>
        <Checkbox defaultChecked disabled>
          Checked
        </Checkbox>
      </Example>

      <Example title="Error" description="Invalid state on the control, label, and helper.">
        <Checkbox error helperText="Helper text goes here">
          Label
        </Checkbox>
      </Example>
    </ComponentSection>
  );
}
