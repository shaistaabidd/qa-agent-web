import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router';

import { firstError, otpSchema, revalidateIfError } from '@/shared/lib/schemas';
import { Button } from '@/shared/ui/button';
import { Otp } from '@/shared/ui/otp';
import { Typography } from '@/shared/ui/Typography';
import { AuthScreenHeader } from '@/shell/auth';

import { useOtpTimer } from './hooks/useOtpTimer';

export type OtpFormValues = {
  otp: string;
};

type OtpFormProps = {
  backLabel?: string;
  description?: string;
  isPending?: boolean;
  isResending?: boolean;
  onResend?: () => boolean | void | Promise<boolean | void>;
  onSubmit?: (values: OtpFormValues) => void | Promise<void>;
  submitLabel?: string;
  title?: string;
};

function resendWaitCopy(remainingSeconds: number) {
  if (remainingSeconds <= 0) {
    return "Didn't receive the code? You can resend a new code now.";
  }

  const unit = remainingSeconds === 1 ? 'second' : 'seconds';

  return `Didn't receive the code? You can resend a new code in ${remainingSeconds} ${unit}.`;
}

export function OtpForm({
  backLabel,
  description = 'Enter your 6-digit verification code',
  isPending = false,
  isResending = false,
  onResend,
  onSubmit,
  submitLabel = 'Verify & Login',
  title = 'Two-factor Authentication',
}: OtpFormProps) {
  const navigate = useNavigate();
  const { remainingSeconds } = useOtpTimer();
  const canResend = remainingSeconds <= 0;
  const form = useForm({
    defaultValues: {
      otp: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
  });

  function handleResend() {
    if (!canResend || isResending) {
      return;
    }

    void (async () => {
      try {
        const resent = await onResend?.();
        if (resent !== false) {
          form.setFieldValue('otp', '');
        }
      } catch {
        // The OTP field keeps its value when resending fails.
      }
    })();
  }

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
        <form.Field
          listeners={{ onChange: revalidateIfError }}
          name="otp"
          validators={{ onBlur: otpSchema, onSubmit: otpSchema }}
        >
          {(field) => {
            const error = firstError(field.state.meta.errors);

            return (
              <Otp
                error={Boolean(error)}
                helperText={error}
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                size="xl"
                slots={6}
                value={field.state.value}
              />
            );
          }}
        </form.Field>
        <div className="flex flex-wrap items-center gap-[8px]">
          <Typography className="text-disabled" size="base">
            {resendWaitCopy(remainingSeconds)}
          </Typography>
          <Button
            className="decoration-dotted"
            disabled={!canResend || isPending || isResending || !onResend}
            onClick={handleResend}
            size="sm"
            type="button"
            variant="link"
          >
            Resend Code
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-[16px]">
        <Button
          aria-busy={isPending}
          className="w-full"
          disabled={isPending}
          leftIcon={
            isPending ? (
              <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
            ) : undefined
          }
          type="submit"
        >
          {isPending ? 'Verifying…' : submitLabel}
        </Button>
        {backLabel ? (
          <Button
            className="decoration-dotted"
            onClick={() => {
              void navigate(-1);
            }}
            size="sm"
            type="button"
            variant="link"
          >
            {backLabel}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
