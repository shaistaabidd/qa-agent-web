import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple';
import { LockIcon } from '@phosphor-icons/react/Lock';
import { useForm } from '@tanstack/react-form';
import { useRef, useState } from 'react';
import { Link } from 'react-router';

import { FormInput } from '@/shared/lib/FormInput';
import { PasswordToggle } from '@/shared/lib/PasswordToggle';
import { emailSchema, passwordSchema } from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Typography } from '@/shared/ui/Typography';
import { AuthScreenHeader } from '@/shell/auth';

import { GoogleSignInButton } from './GoogleSignInButton';

export type LoginFormValues = {
  email: string;
  password: string;
  rememberDevice: boolean;
};

type LoginFormProps = {
  description?: string;
  forgotPasswordTo?: string;
  isPending?: boolean;
  onSubmit?: (values: LoginFormValues) => void | Promise<void>;
  showGoogle?: boolean;
  showSignup?: boolean;
  signupTo?: string;
  title?: string;
};

export function LoginForm({
  description = 'Please enter your credentials to continue.',
  forgotPasswordTo = '/forgot-password',
  isPending = false,
  onSubmit,
  showGoogle = false,
  showSignup = true,
  signupTo = '/signup',
  title = 'Welcome back',
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPendingRef = useRef(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberDevice: false,
    },
    onSubmit: async ({ value }) => {
      if (isPendingRef.current) return;
      isPendingRef.current = true;
      try {
        await onSubmit?.(value);
      } finally {
        isPendingRef.current = false;
      }
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
      <AuthScreenHeader description={description} title={title} />

      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[16px]">
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
            autoComplete="current-password"
            form={form}
            label="Password"
            leftIcon={<LockIcon aria-hidden weight="regular" />}
            name="password"
            placeholder="Enter your password"
            rightIcon={
              <PasswordToggle
                onToggle={() => setShowPassword((visible) => !visible)}
                visible={showPassword}
              />
            }
            size="xl"
            type={showPassword ? 'text' : 'password'}
            validate={passwordSchema}
          />
        </div>

        <div className="flex items-center justify-between gap-[8px]">
          <form.Field name="rememberDevice">
            {(field) => (
              <Checkbox
                checked={field.state.value}
                name={field.name}
                onBlur={field.handleBlur}
                onCheckedChange={field.handleChange}
              >
                Remember this device
              </Checkbox>
            )}
          </form.Field>
          <Button asChild className="decoration-dotted" size="sm" variant="link">
            <Link to={forgotPasswordTo}>Forgot password?</Link>
          </Button>
        </div>
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
                {loading ? 'Logging in…' : 'Log in'}
              </Button>
            );
          }}
        </form.Subscribe>
        {showGoogle ? <GoogleSignInButton /> : null}
        {showSignup ? (
          <div className="flex items-center justify-center gap-[4px]">
            <Typography className="text-center text-disabled" variant="body2">
              Don&apos;t have an account?
            </Typography>
            <Button asChild className="decoration-dotted" size="sm" variant="link">
              <Link to={signupTo}>Sign up now</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
