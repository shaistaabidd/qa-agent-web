import type { ReactNode } from 'react';
import { useId } from 'react';

import type { FormFieldValidator, FormHost } from '@/shared/lib/formTypes';
import { firstError, revalidateIfError } from '@/shared/lib/schemas';
import { Label } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/Typography';

type FormControlFieldProps<TValue> = {
  children: (field: {
    error?: string;
    handleBlur: () => void;
    handleChange: (value: TValue) => void;
    id: string;
    name: string;
    value: TValue;
  }) => ReactNode;
  form: FormHost;
  label: string;
  labelAction?: (field: { handleChange: (value: TValue) => void; value: TValue }) => ReactNode;
  name: string;
  optional?: boolean;
  required?: boolean;
  showError?: boolean;
  showLabel?: boolean;
  validate: FormFieldValidator;
};

export function FormControlField<TValue>({
  children,
  form,
  label,
  labelAction,
  name,
  optional = false,
  required = false,
  showError = true,
  showLabel = true,
  validate,
}: FormControlFieldProps<TValue>) {
  const Field = form.Field;
  const generatedId = useId();

  return (
    <Field
      listeners={{
        onChange: revalidateIfError,
      }}
      name={name}
      validators={{ onBlur: validate, onSubmit: validate }}
    >
      {(field) => {
        const error = firstError(field.state.meta.errors);
        const id = field.name || generatedId;
        const value = field.state.value as TValue;
        const handleChange = field.handleChange as (value: TValue) => void;
        const action = labelAction?.({ handleChange, value });

        return (
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            {showLabel ? (
              action ? (
                <div className="flex w-full items-center justify-between gap-[8px]">
                  <Label
                    bold
                    error={Boolean(error)}
                    htmlFor={id}
                    optional={optional}
                    required={required}
                  >
                    {label}
                  </Label>
                  {action}
                </div>
              ) : (
                <Label
                  bold
                  error={Boolean(error)}
                  htmlFor={id}
                  optional={optional}
                  required={required}
                >
                  {label}
                </Label>
              )
            ) : null}
            {children({
              error,
              handleBlur: field.handleBlur,
              handleChange,
              id,
              name: field.name,
              value,
            })}
            {showError && error ? (
              <Typography className="text-error" size="xs">
                {error}
              </Typography>
            ) : null}
          </div>
        );
      }}
    </Field>
  );
}
