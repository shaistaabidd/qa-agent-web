import { Dropdown, DropdownItem } from '@/shared/ui/dropdown';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Typography } from '@/shared/ui/Typography';

import type { CrudFieldDef } from './types';

export function validateCrudFields(
  fields: CrudFieldDef[],
  values: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const raw = values[field.name] ?? '';
    const value = raw.trim();
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`;
      continue;
    }
    if (field.maxLength != null && raw.length > field.maxLength) {
      errors[field.name] = `${field.label} must be ${field.maxLength} characters or fewer`;
    }
  }
  return errors;
}

export function emptyValuesFromFields(fields: CrudFieldDef[]): Record<string, string> {
  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.type === 'select' ? (field.options?.[0]?.value ?? '') : '',
    ]),
  );
}

export type CrudFormFieldsProps = {
  fields: CrudFieldDef[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
  idPrefix?: string;
};

export function CrudFormFields({
  fields,
  values,
  onChange,
  errors = {},
  idPrefix = 'crud-field',
}: CrudFormFieldsProps) {
  return (
    <div className="flex flex-col gap-[16px]">
      {fields.map((field) => {
        const id = `${idPrefix}-${field.name}`;
        const error = errors[field.name];
        const value = values[field.name] ?? '';

        return (
          <div key={field.name} className="flex flex-col gap-[6px]">
            <Label error={Boolean(error)} htmlFor={id} required={field.required}>
              {field.label}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                aria-invalid={Boolean(error)}
                aria-required={field.required || undefined}
                error={Boolean(error)}
                helperText={error}
                id={id}
                maxLength={field.maxLength}
                onChange={(event) => onChange(field.name, event.target.value)}
                placeholder={field.placeholder}
                rows={4}
                value={value}
              />
            ) : null}
            {field.type === 'select' ? (
              <Dropdown
                aria-invalid={Boolean(error)}
                error={Boolean(error)}
                id={id}
                onValueChange={(next) => onChange(field.name, next)}
                placeholder="Select"
                value={value}
              >
                {(field.options ?? []).map((option) => (
                  <DropdownItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownItem>
                ))}
              </Dropdown>
            ) : null}
            {field.type === 'select' && error ? (
              <Typography className="text-fg-danger" variant="caption">
                {error}
              </Typography>
            ) : null}
            {field.type !== 'textarea' && field.type !== 'select' ? (
              <Input
                aria-invalid={Boolean(error)}
                aria-required={field.required || undefined}
                error={Boolean(error)}
                helperText={error}
                id={id}
                maxLength={field.maxLength}
                onChange={(event) => onChange(field.name, event.target.value)}
                placeholder={field.placeholder}
                value={value}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
