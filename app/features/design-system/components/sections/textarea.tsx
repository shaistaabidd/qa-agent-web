import { type ReactNode, useId } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Button } from '@/shared/ui/button';
import { Label, type LabelProps } from '@/shared/ui/label';
import { Textarea, type TextareaProps } from '@/shared/ui/textarea';

const SIZES = ['sm', 'md', 'lg'] as const;

const SIZE_LABELS = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
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

function LabeledTextarea({
  description,
  error,
  hint,
  id,
  label,
  optional,
  required,
  ...props
}: TextareaProps & {
  description?: LabelProps['description'];
  hint?: boolean;
  label?: ReactNode;
  optional?: boolean;
}) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <Field
      description={description}
      error={error}
      hint={hint}
      htmlFor={textareaId}
      label={label}
      optional={optional}
      required={required}
    >
      <Textarea {...props} error={error} id={textareaId} required={required} />
    </Field>
  );
}

export function TextareaSection() {
  return (
    <ComponentSection
      id="textarea"
      title="Textarea"
      description="SaaS Temp text area with Figma sizes and states. Pair it with Label for the form layout."
    >
      <Example
        title="Sizes"
        description="sm, md, lg. Default size is lg."
        contentClassName="items-start"
      >
        {SIZES.map((size) => (
          <LabeledTextarea
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
        <LabeledTextarea defaultValue="placeholder" helperText="Helper text goes here" />
      </Example>

      <Example title="Disabled" contentClassName="items-start">
        <LabeledTextarea defaultValue="placeholder" helperText="Helper text goes here" disabled />
      </Example>

      <Example
        title="Error"
        description="Error and error-active (focus the field). Helper and label use the error color."
        contentClassName="items-start"
      >
        <LabeledTextarea defaultValue="placeholder" helperText="Helper text goes here" error />
      </Example>

      <Example
        title="With Label"
        description="Required, optional, and hint are Label props. Textarea stays the control."
        contentClassName="items-start"
      >
        <LabeledTextarea placeholder="placeholder" required />
        <LabeledTextarea placeholder="placeholder" optional />
        <LabeledTextarea
          placeholder="placeholder"
          description="Description text"
          hint
          helperText="Helper text goes here"
        />
      </Example>

      <Example
        title="Resize"
        description="resize adds a corner handle to change the width and height. The size is the shortest height."
        contentClassName="flex-col items-start"
      >
        <LabeledTextarea placeholder="placeholder" helperText="No resize" />
        <LabeledTextarea resize placeholder="placeholder" helperText="Drag the corner to resize" />
      </Example>

      <Example
        title="Auto height"
        description="autoHeight grows and shrinks with the text. Combine it with resize to drag the corner."
        contentClassName="items-start"
      >
        <LabeledTextarea
          autoHeight
          placeholder="Type to grow this field"
          helperText="Height follows the content"
        />
        <LabeledTextarea
          autoHeight
          resize
          defaultValue={'Line one\nLine two\nLine three\nLine four\nLine five\nLine six'}
          helperText="Content height, still draggable"
        />
      </Example>

      <Example
        title="Auto height in a form"
        description="Uncontrolled autoHeight textarea. Reset restores the default value and the height."
        contentClassName="items-start"
      >
        <form
          className="flex w-full max-w-[320px] flex-col gap-[12px]"
          data-testid="textarea-reset-form"
        >
          <LabeledTextarea
            autoHeight
            defaultValue="Default"
            name="notes"
            helperText="Type several lines, then reset"
          />
          <Button size="md" type="reset" variant="outline">
            Reset
          </Button>
        </form>
      </Example>
    </ComponentSection>
  );
}
