import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import { type ReactNode, useId } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Input, type InputProps } from '@/shared/ui/input';
import { Label, type LabelProps } from '@/shared/ui/label';

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

function IconInput({
  description,
  error,
  hint,
  id,
  label,
  optional,
  required,
  ...props
}: InputProps & {
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
      <Input
        {...props}
        error={error}
        id={inputId}
        leftIcon={<MagnifyingGlassIcon aria-hidden weight="light" />}
        required={required}
        rightIcon={<CaretDownIcon aria-hidden weight="light" />}
      />
    </Field>
  );
}

export function InputSection() {
  return (
    <ComponentSection
      id="input"
      title="Input"
      description="SaaS Temp input field with Figma sizes, states, and left/right adornments. Pair it with Label for the form layout."
    >
      <Example
        title="Sizes"
        description="sm, md, lg, xl. Default size is lg."
        contentClassName="items-start"
      >
        {SIZES.map((size) => (
          <IconInput
            key={size}
            size={size}
            label={SIZE_LABELS[size]}
            placeholder="placeholder"
            helperText="Helper text goes here"
          />
        ))}
      </Example>

      <Example
        title="Filled"
        description="Typed value uses high-contrast text."
        contentClassName="items-start"
      >
        <IconInput defaultValue="placeholder" helperText="Helper text goes here" />
      </Example>

      <Example title="Disabled" contentClassName="items-start">
        <IconInput defaultValue="placeholder" helperText="Helper text goes here" disabled />
      </Example>

      <Example
        title="Error"
        description="Error and error-active (focus the field). Helper and label use the error color."
        contentClassName="items-start"
      >
        <IconInput defaultValue="placeholder" helperText="Helper text goes here" error />
      </Example>

      <Example
        title="With Label"
        description="Required, optional, and hint are Label props. Input stays the control."
        contentClassName="items-start"
      >
        <IconInput placeholder="placeholder" required />
        <IconInput placeholder="placeholder" optional />
        <IconInput
          placeholder="placeholder"
          description="Description text"
          hint
          helperText="Helper text goes here"
        />
      </Example>

      <Example title="Without adornments" contentClassName="items-start">
        <PlainField />
      </Example>
    </ComponentSection>
  );
}

function PlainField() {
  const id = useId();

  return (
    <Field htmlFor={id}>
      <Input id={id} placeholder="placeholder" helperText="Helper text goes here" />
    </Field>
  );
}
