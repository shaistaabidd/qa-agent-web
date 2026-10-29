import { useForm } from '@tanstack/react-form';

import { FormInput } from '@/shared/lib/FormInput';
import { FormPhoneField } from '@/shared/lib/FormPhoneField';
import { firstNameSchema, lastNameSchema, optionalPhoneSchema } from '@/shared/lib/schemas';

import { SettingsDialog } from './SettingsDialog';

export type DetailsValues = { firstName: string; lastName: string; phone: string };

type EditDetailsDialogProps = {
  initial: DetailsValues;
  onOpenChange: (open: boolean) => void;
  onSave: (value: DetailsValues) => void | Promise<void>;
  open: boolean;
};

/** Name and phone in one form. The login email has its own Change Email flow (it needs a code). */
export function EditDetailsDialog({ initial, onOpenChange, onSave, open }: EditDetailsDialogProps) {
  const form = useForm({
    defaultValues: initial,
    onSubmit: async ({ value }) => {
      await onSave({
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        phone: value.phone,
      });
    },
  });

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <SettingsDialog
          confirmLabel="Save Changes"
          confirmPending={isSubmitting}
          onOpenChange={onOpenChange}
          onSubmit={() => form.handleSubmit()}
          open={open}
          title="Edit Details"
        >
          <div className="flex flex-col gap-[20px]">
            <FormInput
              autoComplete="given-name"
              form={form}
              label="First Name"
              name="firstName"
              size="lg"
              validate={firstNameSchema}
            />
            <FormInput
              autoComplete="family-name"
              form={form}
              label="Last Name"
              name="lastName"
              size="lg"
              validate={lastNameSchema}
            />
            <FormPhoneField
              form={form}
              label="Phone Number"
              name="phone"
              size="lg"
              validate={optionalPhoneSchema}
            />
          </div>
        </SettingsDialog>
      )}
    </form.Subscribe>
  );
}
