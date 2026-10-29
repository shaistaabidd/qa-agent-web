import { type ReactNode, useId } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Label, type LabelProps } from '@/shared/ui/label';
import { PhoneInput, type PhoneInputProps } from '@/shared/ui/phone-input';

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
  label = 'Phone',
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

function PhoneField({
  description,
  error,
  hint,
  id,
  label,
  optional,
  required,
  ...props
}: PhoneInputProps & {
  description?: LabelProps['description'];
  hint?: boolean;
  label?: ReactNode;
  optional?: boolean;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Field
      description={description}
      error={error}
      hint={hint}
      htmlFor={inputId}
      label={label}
      optional={optional}
      required={required}
    >
      <PhoneInput {...props} error={error} id={inputId} required={required} />
    </Field>
  );
}

export function PhoneInputSection() {
  return (
    <ComponentSection
      id="phone-input"
      title="Phone Input"
      description="SaaS Temp phone field with country flag, calling code, and Input sizes and states. Pair it with Label for the form layout."
    >
      <Example
        title="Sizes"
        description="sm, md, lg, xl. Default size is lg."
        contentClassName="items-start"
      >
        {SIZES.map((size) => (
          <PhoneField
            key={size}
            helperText="Helper text goes here"
            label={SIZE_LABELS[size]}
            size={size}
          />
        ))}
      </Example>

      <Example
        title="Filled"
        description="National format with the country prefix outside the field."
        contentClassName="items-start"
      >
        <PhoneField defaultValue="+13125550148" helperText="Helper text goes here" required />
      </Example>

      <Example title="Disabled" contentClassName="items-start">
        <PhoneField defaultValue="+13125550148" disabled helperText="Helper text goes here" />
      </Example>

      <Example
        title="Error"
        description="Error and error-active (focus the field). Helper and label use the error color."
        contentClassName="items-start"
      >
        <PhoneField defaultValue="+13125550148" error helperText="Helper text goes here" />
      </Example>

      <Example
        title="With Label"
        description="Required, optional, and hint are Label props. Phone Input stays the control."
        contentClassName="items-start"
      >
        <PhoneField required />
        <PhoneField optional />
        <PhoneField description="Description text" helperText="Helper text goes here" hint />
      </Example>

      <Example
        title="Locked countries"
        description="Pass allowedCountries to lock the picker. One country hides the menu; a short list only offers those options."
        contentClassName="items-start overflow-visible"
      >
        <PhoneField
          allowedCountries={['US']}
          defaultValue="+13125550148"
          helperText="US numbers only"
          label="United States"
        />
        <PhoneField
          allowedCountries={['US', 'CA', 'GB']}
          helperText="US, Canada, or United Kingdom"
          label="US, CA, GB"
        />
      </Example>
    </ComponentSection>
  );
}
