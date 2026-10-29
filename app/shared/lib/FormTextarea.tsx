import { FormControlField } from '@/shared/lib/FormControlField';
import type { FormFieldValidator, FormHost } from '@/shared/lib/formTypes';
import type { TextareaSize } from '@/shared/ui/textarea';
import { Textarea } from '@/shared/ui/textarea';

type FormTextareaProps = {
  form: FormHost;
  label: string;
  name: string;
  optional?: boolean;
  placeholder?: string;
  required?: boolean;
  size?: TextareaSize;
  validate: FormFieldValidator;
};

export function FormTextarea({
  form,
  label,
  name,
  optional = false,
  placeholder,
  required = false,
  size = 'lg',
  validate,
}: FormTextareaProps) {
  return (
    <FormControlField<string>
      form={form}
      label={label}
      name={name}
      optional={optional}
      required={required}
      showError={false}
      validate={validate}
    >
      {({ error, handleBlur, handleChange, id, name: fieldName, value }) => (
        <Textarea
          error={Boolean(error)}
          helperText={error}
          id={id}
          name={fieldName}
          onBlur={handleBlur}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          size={size}
          value={value}
        />
      )}
    </FormControlField>
  );
}
