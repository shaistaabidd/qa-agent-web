import { type ReactNode, useId } from 'react';

import type { FormFieldChangeProps, FormFieldValidator, FormHost } from '@/shared/lib/formTypes';
import { firstError, revalidateIfError } from '@/shared/lib/schemas';
import { Input, type InputProps } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

type FormInputProps = {
  children?: ((value: string) => ReactNode) | ReactNode;
  description?: string;
  form: FormHost;
  formatValue?: (value: string) => string;
  label: string;
  name: string;
  onFieldChange?: (props: FormFieldChangeProps) => void;
  optional?: boolean;
  required?: boolean;
  showLabel?: boolean;
  validate: FormFieldValidator;
} & Omit<
  InputProps,
  'children' | 'error' | 'form' | 'helperText' | 'id' | 'name' | 'onBlur' | 'onChange' | 'value'
>;

export function FormInput({
  children,
  description,
  form,
  formatValue,
  label,
  name,
  onFieldChange,
  optional = false,
  required = false,
  showLabel = true,
  validate,
  ...inputProps
}: FormInputProps) {
  const Field = form.Field;
  const idPrefix = useId();

  return (
    <Field
      listeners={{
        onChange: (props) => {
          revalidateIfError(props);
          onFieldChange?.(props);
        },
      }}
      name={name}
      validators={{ onBlur: validate, onSubmit: validate }}
    >
      {(field) => {
        const error = firstError(field.state.meta.errors);
        const input = (
          <div className="flex flex-col gap-[8px]">
            {showLabel ? (
              <Label
                bold
                description={description}
                error={Boolean(error)}
                htmlFor={`${idPrefix}-${field.name}`}
                optional={optional}
                required={required}
              >
                {label}
              </Label>
            ) : null}
            <Input
              {...inputProps}
              aria-required={required || undefined}
              aria-label={showLabel ? inputProps['aria-label'] : label}
              error={Boolean(error)}
              helperText={error}
              id={`${idPrefix}-${field.name}`}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(
                  formatValue ? formatValue(event.target.value) : event.target.value,
                )
              }
              value={field.state.value}
            />
          </div>
        );

        if (!children) {
          return input;
        }

        return (
          <div className="flex flex-col gap-[12px]">
            {input}
            {typeof children === 'function' ? children(field.state.value) : children}
          </div>
        );
      }}
    </Field>
  );
}
