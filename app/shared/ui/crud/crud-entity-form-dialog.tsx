import * as React from 'react';

import { getMessageString } from '@/shared/lib/getMessageString';

import { CrudFormDialog } from './crud-form-dialog';
import { CrudFormFields, emptyValuesFromFields, validateCrudFields } from './crud-form-fields';
import type { CrudFieldDef } from './types';

export type CrudEntityFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  fields: CrudFieldDef[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
};

export function CrudEntityFormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  fields,
  initialValues,
  onSubmit,
}: CrudEntityFormDialogProps) {
  const [values, setValues] = React.useState<Record<string, string>>(() => ({
    ...emptyValuesFromFields(fields),
    ...initialValues,
  }));
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setValues({ ...emptyValuesFromFields(fields), ...initialValues });
      setFieldErrors({});
      setFormError(null);
      setSubmitting(false);
    }
  }

  return (
    <CrudFormDialog
      description={description}
      error={formError}
      onOpenChange={onOpenChange}
      onSubmit={async () => {
        const errors = validateCrudFields(fields, values);
        setFieldErrors(errors);
        if (Object.keys(errors).length) return;

        setSubmitting(true);
        setFormError(null);
        try {
          await onSubmit(values);
          onOpenChange(false);
        } catch (err) {
          setFormError(getMessageString(err, 'Something went wrong. Please try again.'));
        } finally {
          setSubmitting(false);
        }
      }}
      open={open}
      submitLabel={submitLabel}
      submitting={submitting}
      title={title}
    >
      <CrudFormFields
        errors={fieldErrors}
        fields={fields}
        onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
        values={values}
      />
    </CrudFormDialog>
  );
}
