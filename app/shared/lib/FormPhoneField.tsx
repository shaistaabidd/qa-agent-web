import { FormControlField } from '@/shared/lib/FormControlField';
import type { FormFieldValidator, FormHost } from '@/shared/lib/formTypes';
import { PhoneInput, type PhoneInputSize } from '@/shared/ui/phone-input';

type FormPhoneFieldProps = {
  disabled?: boolean;
  form: FormHost;
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  size?: PhoneInputSize;
  validate: FormFieldValidator;
};

export function FormPhoneField({
  disabled = false,
  form,
  label = 'Phone Number',
  name,
  placeholder = 'Enter phone number',
  required = false,
  size = 'xl',
  validate,
}: FormPhoneFieldProps) {
  return (
    <FormControlField<string>
      form={form}
      label={label}
      name={name}
      required={required}
      showError={false}
      validate={validate}
    >
      {({ error, handleBlur, handleChange, id, name: fieldName, value }) => (
        <PhoneInput
          defaultCountry="US"
          disabled={disabled}
          error={Boolean(error)}
          helperText={error}
          id={id}
          name={fieldName}
          onBlur={handleBlur}
          onChange={(next) => handleChange(next ?? '')}
          placeholder={placeholder}
          size={size}
          value={value || undefined}
        />
      )}
    </FormControlField>
  );
}
