import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { LockIcon } from '@phosphor-icons/react/Lock';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { FormInput } from '@/shared/lib/FormInput';
import { PasswordToggle } from '@/shared/lib/PasswordToggle';
import { confirmPasswordError, strongPasswordSchema } from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { AuthScreenHeader } from '@/shell/auth';

import { PasswordRequirements } from './PasswordRequirements';

export type ResetPasswordFormValues = {
  confirmPassword: string;
  password: string;
};

type ResetPasswordFormProps = {
  isPending?: boolean;
  onSubmit?: (values: ResetPasswordFormValues) => void | Promise<void>;
};

export function ResetPasswordForm({ isPending = false, onSubmit }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      confirmPassword: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
  });

  return (
    <form
      className="flex w-full flex-col gap-[24px] xl:gap-[32px]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <AuthScreenHeader
        description="Create a new password for your account."
        title="Reset Password"
      />

      <div className="flex flex-col gap-[16px]">
        <FormInput
          autoComplete="new-password"
          form={form}
          label="New Password"
          leftIcon={<LockIcon aria-hidden weight="regular" />}
          name="password"
          onFieldChange={({ fieldApi }) => {
            const confirmErrors = fieldApi.form.getFieldMeta('confirmPassword')?.errors ?? [];

            if (confirmErrors.length > 0) {
              void fieldApi.form.validateField('confirmPassword', 'blur');
            }
          }}
          placeholder="Enter your password"
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowPassword((visible) => !visible)}
              visible={showPassword}
            />
          }
          size="xl"
          type={showPassword ? 'text' : 'password'}
          validate={strongPasswordSchema}
        >
          {(password) => <PasswordRequirements password={password} />}
        </FormInput>

        <FormInput
          autoComplete="new-password"
          form={form}
          label="Confirm New Password"
          leftIcon={<LockIcon aria-hidden weight="regular" />}
          name="confirmPassword"
          placeholder="Re-enter password"
          rightIcon={
            <PasswordToggle
              onToggle={() => setShowConfirmPassword((visible) => !visible)}
              visible={showConfirmPassword}
            />
          }
          size="xl"
          type={showConfirmPassword ? 'text' : 'password'}
          validate={confirmPasswordError}
        />
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => {
          const loading = isPending || isSubmitting;

          return (
            <Button
              aria-busy={loading}
              className="w-full"
              disabled={loading}
              leftIcon={
                loading ? (
                  <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
                ) : undefined
              }
              type="submit"
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </Button>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
