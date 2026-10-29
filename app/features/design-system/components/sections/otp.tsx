import { type ReactNode, useId } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Label, type LabelProps } from '@/shared/ui/label';
import { Otp, type OtpProps } from '@/shared/ui/otp';

const SIZES = ['sm', 'md', 'lg', 'xl'] as const;

const SIZE_LABELS = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
} as const;

function Field({
  children,
  description,
  error,
  hint,
  htmlFor,
  label = 'Label',
  optional,
  required,
}: {
  children: ReactNode;
  htmlFor: string;
  label?: ReactNode;
} & Pick<LabelProps, 'description' | 'error' | 'hint' | 'optional' | 'required'>) {
  return (
    <div className="flex w-full max-w-[360px] flex-col gap-[8px]">
      <Label
        description={description}
        error={error}
        hint={hint}
        htmlFor={htmlFor}
        optional={optional}
        required={required}
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function OtpField({
  description,
  error,
  hint,
  id,
  label,
  optional,
  required,
  ...props
}: OtpProps & {
  description?: LabelProps['description'];
  hint?: boolean;
  label?: ReactNode;
  optional?: boolean;
}) {
  const generatedId = useId();
  const otpId = id ?? generatedId;

  return (
    <Field
      description={description}
      error={error}
      hint={hint}
      htmlFor={otpId}
      label={label}
      optional={optional}
      required={required}
    >
      <Otp {...props} error={error} id={otpId} required={required} />
    </Field>
  );
}

export function OtpSection() {
  return (
    <ComponentSection
      id="otp"
      title="OTP"
      description="SaaS Temp one-time password field. Default size is xl with 6 slots. Pair it with Label for the form layout."
    >
      <Example
        title="Sizes"
        description="sm, md, lg, xl. Default size is xl."
        contentClassName="items-start"
      >
        {SIZES.map((size) => (
          <OtpField
            key={size}
            helperText="Helper text goes here"
            label={SIZE_LABELS[size]}
            size={size}
          />
        ))}
      </Example>

      <Example
        title="Filled"
        description="Typed digits use high-contrast text."
        contentClassName="items-start"
      >
        <OtpField defaultValue="424854" helperText="Helper text goes here" />
      </Example>

      <Example title="Disabled" contentClassName="items-start">
        <OtpField defaultValue="424854" disabled helperText="Helper text goes here" />
      </Example>

      <Example
        title="Error"
        description="Error and error-active (focus a slot). Helper and label use the error color."
        contentClassName="items-start"
      >
        <OtpField defaultValue="424854" error helperText="Helper text goes here" />
      </Example>

      <Example
        title="With Label"
        description="Required, optional, and hint are Label props. OTP stays the control."
        contentClassName="items-start"
      >
        <OtpField required />
        <OtpField optional />
        <OtpField description="Description text" helperText="Helper text goes here" hint />
      </Example>

      <Example
        title="4 slots"
        description="Use slots to match a shorter code length."
        contentClassName="items-start"
      >
        <OtpField helperText="Helper text goes here" slots={4} />
      </Example>
    </ComponentSection>
  );
}
