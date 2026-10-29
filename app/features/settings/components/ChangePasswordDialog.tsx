import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { PasswordRequirements } from '@/features/auth';
import { FormInput } from '@/shared/lib/FormInput';
import { PasswordToggle } from '@/shared/lib/PasswordToggle';
import { confirmPasswordError, passwordSchema, strongPasswordSchema } from '@/shared/lib/schemas';

import { SettingsDialog } from './SettingsDialog';

type ChangePasswordDialogProps = {
  onOpenChange: (open: boolean) => void;
  onSave: (value: { currentPassword: string; password: string }) => void | Promise<void>;
  open: boolean;
};

export function ChangePasswordDialog({ onOpenChange, onSave, open }: ChangePasswordDialogProps) {
  const [visible, setVisible] = useState({
    confirm: false,
    current: false,
    next: false,
  });

  const form = useForm({
    defaultValues: {
      confirmPassword: '',
      currentPassword: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await onSave({
        currentPassword: value.currentPassword,
        password: value.password,
      });
    },
  });

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <SettingsDialog
          confirmLabel="Change Password"
          confirmPending={isSubmitting}
          onOpenChange={(next) => {
            if (!next) {
              form.reset();
              setVisible({ confirm: false, current: false, next: false });
            }
            onOpenChange(next);
          }}
          onSubmit={() => form.handleSubmit()}
          open={open}
          title="Change Password"
        >
          <div className="flex flex-col gap-[20px]">
            <FormInput
              autoComplete="current-password"
              form={form}
              label="Current Password"
              name="currentPassword"
              placeholder="Enter your password"
              rightIcon={
                <PasswordToggle
                  onToggle={() =>
                    setVisible((current) => ({
                      ...current,
                      current: !current.current,
                    }))
                  }
                  visible={visible.current}
                />
              }
              size="lg"
              type={visible.current ? 'text' : 'password'}
              validate={passwordSchema}
            />
            <FormInput
              autoComplete="new-password"
              form={form}
              label="New Password"
              name="password"
              onFieldChange={({ fieldApi }) => {
                const confirmErrors = fieldApi.form.getFieldMeta('confirmPassword')?.errors ?? [];

                if (confirmErrors.length > 0) {
                  void fieldApi.form.validateField('confirmPassword', 'blur');
                }
              }}
              placeholder="Enter new password"
              rightIcon={
                <PasswordToggle
                  onToggle={() => setVisible((current) => ({ ...current, next: !current.next }))}
                  visible={visible.next}
                />
              }
              size="lg"
              type={visible.next ? 'text' : 'password'}
              validate={strongPasswordSchema}
            >
              {(password) => <PasswordRequirements password={password} />}
            </FormInput>
            <FormInput
              autoComplete="new-password"
              form={form}
              label="Confirm New Password"
              name="confirmPassword"
              placeholder="Re-enter password"
              rightIcon={
                <PasswordToggle
                  onToggle={() =>
                    setVisible((current) => ({
                      ...current,
                      confirm: !current.confirm,
                    }))
                  }
                  visible={visible.confirm}
                />
              }
              size="lg"
              type={visible.confirm ? 'text' : 'password'}
              validate={confirmPasswordError}
            />
          </div>
        </SettingsDialog>
      )}
    </form.Subscribe>
  );
}
