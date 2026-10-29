import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { LockIcon } from '@phosphor-icons/react/Lock';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { PasswordRequirements } from '@/features/auth';
import { FormInput } from '@/shared/lib/FormInput';
import { PasswordToggle } from '@/shared/lib/PasswordToggle';
import { confirmPasswordError, strongPasswordSchema } from '@/shared/lib/schemas';
import { Alert, AlertAction, AlertClose, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { AuthScreenHeader } from '@/shell/auth';

export type InviteSetupFormValues = {
  confirmPassword: string;
  password: string;
};

type InviteSetupFormProps = {
  email?: string;
  isPending?: boolean;
  onSubmit?: (values: InviteSetupFormValues) => void | Promise<void>;
};

export function InviteSetupForm({ email, isPending = false, onSubmit }: InviteSetupFormProps) {
  const [showInviteAlert, setShowInviteAlert] = useState(Boolean(email));
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
        description="Set your password to create your account"
        title="Set Up Your Account"
      />

      {showInviteAlert && email ? (
        <Alert variant="info">
          <AlertTitle>
            <span className="font-normal">You&apos;ve been invited on your following email: </span>
            {email}
          </AlertTitle>
          <AlertAction>
            <AlertClose onClick={() => setShowInviteAlert(false)} />
          </AlertAction>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-[16px]">
        <FormInput
          autoComplete="new-password"
          form={form}
          label="Password"
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
          label="Confirm Password"
          leftIcon={<LockIcon aria-hidden weight="regular" />}
          name="confirmPassword"
          placeholder="Confirm your password"
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
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
