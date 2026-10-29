import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { useFeatureFlags } from '@/features/feature-flags';
import { FormInput } from '@/shared/lib/FormInput';
import { PasswordToggle } from '@/shared/lib/PasswordToggle';
import { emailSchema, passwordSchema } from '@/shared/lib/schemas';

import { SettingsDialog } from './SettingsDialog';

type NewEmailDialogProps = {
  currentEmail: string;
  onOpenChange: (open: boolean) => void;
  onSubmitEmail: (email: string, currentPassword: string) => void | Promise<void>;
  open: boolean;
};

export function NewEmailDialog({
  currentEmail,
  onOpenChange,
  onSubmitEmail,
  open,
}: NewEmailDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { isEnabled, loaded } = useFeatureFlags();
  // Until the flags load, describe the safer default (a code) rather than a change that may not happen.
  const sendsCode = !loaded || isEnabled('emailChangeOtpEnabled');
  const form = useForm({
    defaultValues: {
      currentPassword: '',
      email: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmitEmail(value.email, value.currentPassword);
    },
  });

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <SettingsDialog
          confirmLabel={sendsCode ? 'Send Code' : 'Change Email'}
          confirmPending={isSubmitting}
          description={
            sendsCode
              ? `Your login email is currently ${currentEmail}. We'll send a code to the new address.`
              : `Your login email is currently ${currentEmail}. It changes right away, and we'll let ${currentEmail} know.`
          }
          onOpenChange={(next) => {
            if (!next) {
              form.reset();
            }
            onOpenChange(next);
          }}
          onSubmit={() => form.handleSubmit()}
          open={open}
          title="Enter New Email"
        >
          <FormInput
            autoComplete="email"
            form={form}
            label="New email address"
            name="email"
            size="md"
            type="email"
            validate={emailSchema}
          />
          <FormInput
            autoComplete="current-password"
            form={form}
            label="Current password"
            name="currentPassword"
            rightIcon={
              <PasswordToggle
                onToggle={() => setShowPassword((visible) => !visible)}
                visible={showPassword}
              />
            }
            size="md"
            type={showPassword ? 'text' : 'password'}
            validate={passwordSchema}
          />
        </SettingsDialog>
      )}
    </form.Subscribe>
  );
}
