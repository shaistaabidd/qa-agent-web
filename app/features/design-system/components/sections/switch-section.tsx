import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Switch } from '@/shared/ui/switch';
import type { SwitchCheck, SwitchInteraction } from '@/shared/ui/switch/types';
import { getPreviewControlClassName, getThumbClassName } from '@/shared/ui/switch/utils';

const CHECKS: { check: SwitchCheck; label: string }[] = [
  { check: 'off', label: 'Active=False' },
  { check: 'on', label: 'Active=True' },
];

const INTERACTIONS: { interaction: SwitchInteraction; label: string }[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
  { interaction: 'pressed', label: 'Pressed' },
];

const DISABLED_INTERACTIONS: {
  interaction: SwitchInteraction;
  label: string;
}[] = [
  { interaction: 'default', label: 'Default' },
  { interaction: 'hover', label: 'Hover' },
];

function PreviewControl({
  check,
  disabled = false,
  interaction,
}: {
  check: SwitchCheck;
  disabled?: boolean;
  interaction: SwitchInteraction;
}) {
  return (
    <span
      className={getPreviewControlClassName(check, interaction, disabled)}
      data-check={check}
      data-disabled={disabled || undefined}
      data-slot="switch-control"
    >
      <span
        className={getThumbClassName(disabled)}
        data-disabled={disabled || undefined}
        data-slot="switch-thumb"
      />
    </span>
  );
}

export function SwitchSection() {
  return (
    <ComponentSection
      id="switch"
      title="Switch"
      description="A control that allows the user to toggle between checked and not checked."
    >
      <Example
        title="Switch Item states"
        description="Default, hover, and pressed across off and on."
        contentClassName="overflow-visible"
      >
        <div className="grid grid-cols-[auto_repeat(2,minmax(0,4rem))] items-center gap-x-8 gap-y-6">
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
        title="Disabled states"
        description="Disabled keeps a grey track and thumb. Hover uses the disabled surface."
        contentClassName="overflow-visible"
      >
        <div className="grid grid-cols-[auto_repeat(2,minmax(0,4rem))] items-center gap-x-8 gap-y-6">
          <span />
          {CHECKS.map(({ check, label }) => (
            <span
              key={check}
              className="text-center font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]"
            >
              {label}
            </span>
          ))}
          {DISABLED_INTERACTIONS.map(({ interaction, label }) => (
            <div key={interaction} className="contents">
              <span className="font-mono text-[12px] text-[#7B61FF] dark:text-[#a99bff]">
                {label}
              </span>
              {CHECKS.map(({ check }) => (
                <span key={`disabled-${interaction}-${check}`} className="flex justify-center">
                  <PreviewControl check={check} disabled interaction={interaction} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Example>

      <Example title="Interactive" description="Click to toggle between off and on.">
        <Switch id="switch-off">Off</Switch>
        <Switch defaultChecked id="switch-on">
          On
        </Switch>
      </Example>

      <Example
        title="Placement"
        description="Label and helper sit in a column. Switch is 8px to the left or right, aligned with the label."
        contentClassName="items-start"
      >
        <Switch helperText="Helper text goes here" id="switch-placement-left">
          Label
        </Switch>
        <Switch helperText="Helper text goes here" id="switch-placement-right" placement="right">
          Label
        </Switch>
      </Example>

      <Example
        title="Disabled"
        description="Cursor is not-allowed. Off and on both use the disabled surface and grey thumb."
      >
        <Switch disabled id="switch-disabled-off">
          Off
        </Switch>
        <Switch defaultChecked disabled id="switch-disabled-on">
          On
        </Switch>
      </Example>
    </ComponentSection>
  );
}
