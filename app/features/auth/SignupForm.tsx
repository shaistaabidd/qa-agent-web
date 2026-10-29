import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple';
import { LockIcon } from '@phosphor-icons/react/Lock';
import { UserIcon } from '@phosphor-icons/react/User';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { Link } from 'react-router';

import { FormInput } from '@/shared/lib/FormInput';
import { PasswordToggle } from '@/shared/lib/PasswordToggle';
import {
  confirmPasswordError,
  emailSchema,
  requiredText,
  strongPasswordSchema,
} from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';
import { AuthScreenHeader } from '@/shell/auth';

import { GoogleSignInButton } from './GoogleSignInButton';
import { PasswordRequirements } from './PasswordRequirements';
import { LOGIN_PATH } from './paths';

export type SignupFormValues = {
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type SignupFormProps = {
  isPending?: boolean;
  onSubmit?: (values: SignupFormValues) => void | Promise<void>;
  showGoogle?: boolean;
};

const required = requiredText('This field is required');

export function SignupForm({ isPending = false, onSubmit, showGoogle = false }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
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
        description="Create your account. We'll email you a code to confirm it's you."
        title="Create an account"
      />

      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[16px] sm:flex-row">
          <FormInput
            autoComplete="given-name"
            form={form}
            label="First name"
            leftIcon={<UserIcon aria-hidden weight="regular" />}
            name="firstName"
            placeholder="Enter first name"
            size="xl"
            validate={required}
          />
          <FormInput
            autoComplete="family-name"
            form={form}
            label="Last name"
            leftIcon={<UserIcon aria-hidden weight="regular" />}
            name="lastName"
            placeholder="Enter last name"
            size="xl"
            validate={required}
          />
        </div>

        <FormInput
          autoComplete="email"
          form={form}
          label="Email address"
          leftIcon={<EnvelopeSimpleIcon aria-hidden weight="regular" />}
          name="email"
          placeholder="Enter email address"
          size="xl"
          type="email"
          validate={emailSchema}
        />

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
          label="Confirm password"
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

      <div className="flex flex-col gap-[16px]">
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
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            );
          }}
        </form.Subscribe>

        {showGoogle ? <GoogleSignInButton /> : null}

        <Typography className="text-center text-medium" size="sm">
          Already have an account?{' '}
          <Button asChild className="decoration-dotted" size="sm" variant="link">
            <Link to={LOGIN_PATH}>Log in</Link>
          </Button>
        </Typography>
      </div>
    </form>
  );
}
