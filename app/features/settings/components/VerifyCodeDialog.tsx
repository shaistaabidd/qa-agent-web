import { useForm } from '@tanstack/react-form';
import { useRef, useState } from 'react';

import { firstError, otpSchema } from '@/shared/lib/schemas';
import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Otp } from '@/shared/ui/otp';
import { Typography } from '@/shared/ui/Typography';

import { OTP_RESEND_COOLDOWN_SECONDS } from '../constants';
import { reportSettingsError } from '../errors';
import { useCountdown } from '../hooks';
import { formatCountdown } from '../utils';
import { SettingsDialog } from './SettingsDialog';

type VerifyCodeDialogProps = {
  description?: string;
  onOpenChange: (open: boolean) => void;
  onResend?: () => void | Promise<unknown>;
  onVerify: (code: string) => void | Promise<void>;
  open: boolean;
};

export function VerifyCodeDialog({
  description = 'Enter the 6-digit verification code.',
  onOpenChange,
  onResend,
  onVerify,
  open,
}: VerifyCodeDialogProps) {
  const resendCooldown = useCountdown(OTP_RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const resendingRef = useRef(false);

  async function handleResend(onCleared: () => void) {
    if (resendingRef.current) {
      return;
    }

    resendingRef.current = true;
    setResending(true);

    try {
      await onResend?.();
      onCleared();
      resendCooldown.reset();
    } catch (error) {
      reportSettingsError(error);
    } finally {
      resendingRef.current = false;
      setResending(false);
    }
  }

  const form = useForm({
    defaultValues: {
      otp: '',
    },
    onSubmit: async ({ value }) => {
      await onVerify(value.otp);
    },
  });

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <SettingsDialog
          confirmLabel="Verify Code"
          confirmPending={isSubmitting}
          description={description}
          onOpenChange={(next) => {
            if (!next) {
              form.reset();
            }
            onOpenChange(next);
          }}
          onSubmit={() => form.handleSubmit()}
          open={open}
          title="Enter the verification code"
        >
          <div
            className={cn(
              'flex w-full flex-col items-center gap-[12px] overflow-x-auto',
              scrollbarClass,
            )}
          >
            <form.Field name="otp" validators={{ onBlur: otpSchema, onSubmit: otpSchema }}>
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
                    value={field.state.value}
                  />
                );
              }}
            </form.Field>
            <div className="flex flex-wrap items-center justify-center gap-[8px]">
              <Typography className="text-disabled" size="base">
                Didn&apos;t receive the code?
              </Typography>
              {onResend ? (
                <Button
                  className="decoration-dotted"
                  disabled={isSubmitting || resending || resendCooldown.remainingSeconds > 0}
                  onClick={() => {
                    void handleResend(() => form.setFieldValue('otp', ''));
                  }}
                  size="sm"
                  type="button"
                  variant="link"
                >
                  {resendCooldown.remainingSeconds > 0
                    ? `Resend (${formatCountdown(resendCooldown.remainingSeconds)})`
                    : 'Resend'}
                </Button>
              ) : null}
            </div>
          </div>
        </SettingsDialog>
      )}
    </form.Subscribe>
  );
}
