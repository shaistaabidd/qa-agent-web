import type { AnyFieldApi, StandardSchemaV1 } from '@tanstack/react-form';
import type { ComponentType, ReactNode } from 'react';

export type FormFieldChangeProps = { fieldApi: AnyFieldApi };

type FormValidatorFn = (props: { fieldApi: AnyFieldApi; value: string }) => string | undefined;

/** A schema or function that checks one text field. */
export type FormFieldValidator = FormValidatorFn | StandardSchemaV1<string, unknown>;

type FormFieldProps = {
  children: (field: AnyFieldApi) => ReactNode;
  listeners?: { onChange?: (props: FormFieldChangeProps) => void };
  name: string;
  validators?: { onBlur?: FormFieldValidator; onSubmit?: FormFieldValidator };
};

/** The part of a TanStack form that our field wrappers use. */
export type FormHost = {
  Field: ComponentType<FormFieldProps>;
};
