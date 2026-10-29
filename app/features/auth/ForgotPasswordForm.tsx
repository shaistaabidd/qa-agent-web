import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple';
import { useForm } from '@tanstack/react-form';
import { Link } from 'react-router';

import { FormInput } from '@/shared/lib/FormInput';
import { emailSchema } from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { AuthScreenHeader } from '@/shell/auth';

export type ForgotPasswordFormValues = {
  email: string;
};

type ForgotPasswordFormProps = {
  isPending?: boolean;
  loginTo?: string;
  onSubmit?: (values: ForgotPasswordFormValues) => void | Promise<void>;
};

export function ForgotPasswordForm({
  isPending = false,
  loginTo = '/login',
  onSubmit,
}: ForgotPasswordFormProps) {
  const form = useForm({
    defaultValues: {
      email: '',
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
        description="Enter your email address and we will send a verification code to reset your password."
        title="Forgot Password"
      />

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

      <div className="flex flex-col items-center gap-[16px]">
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
                {loading ? 'Sending…' : 'Send Verification Code'}
              </Button>
            );
          }}
        </form.Subscribe>
        <Button asChild className="decoration-dotted" size="sm" variant="link">
          <Link to={loginTo}>Back to login</Link>
        </Button>
      </div>
    </form>
  );
}
