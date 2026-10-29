import { FormControlField } from '@/shared/lib/FormControlField';
import type { FormFieldValidator, FormHost } from '@/shared/lib/formTypes';
import { Dropdown, DropdownItem, type DropdownSize } from '@/shared/ui/dropdown';

type Option = {
  label: string;
  value: string;
};

type FormDropdownProps = {
  disabled?: boolean;
  form: FormHost;
  label: string;
  name: string;
  options: readonly Option[] | Option[];
  placeholder?: string;
  required?: boolean;
  showLabel?: boolean;
  size?: DropdownSize;
  validate: FormFieldValidator;
};

export function FormDropdown({
  disabled = false,
  form,
  label,
  name,
  options,
  placeholder,
  required = false,
  showLabel = true,
  size = 'xl',
  validate,
}: FormDropdownProps) {
  return (
    <FormControlField<string>
      form={form}
      label={label}
      name={name}
      required={required}
      showLabel={showLabel}
      validate={validate}
    >
      {({ error, handleBlur, handleChange, id, value }) => (
        <Dropdown
          aria-invalid={Boolean(error)}
          aria-label={showLabel ? undefined : label}
          disabled={disabled}
          error={Boolean(error)}
          id={id}
          onBlur={handleBlur}
          onValueChange={handleChange}
          placeholder={placeholder}
          size={size}
          value={value || undefined}
        >
          {options.map((option) => (
            <DropdownItem key={option.value} value={option.value}>
              {option.label}
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </FormControlField>
  );
}
