import { ArrowLeftIcon } from '@phosphor-icons/react/ArrowLeft';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';

import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

export type FormPageHeaderProps = {
  backAriaLabel?: string;
  discardLabel?: string;
  loading?: boolean;
  onBack: () => void;
  onDiscard?: () => void;
  onSecondary?: () => void;
  secondaryDisabled?: boolean;
  secondaryLabel?: string;
  secondaryLoading?: boolean;
  submitDisabled?: boolean;
  submitForm?: string;
  submitLabel: string;
  submitPending?: boolean;
  title: string;
};

export function FormPageHeader({
  backAriaLabel = 'Back',
  discardLabel = 'Discard',
  loading = false,
  onBack,
  onDiscard,
  onSecondary,
  secondaryDisabled = false,
  secondaryLabel,
  secondaryLoading = false,
  submitDisabled = false,
  submitForm,
  submitLabel,
  submitPending = false,
  title,
}: FormPageHeaderProps) {
  const showSecondary = Boolean(onSecondary && secondaryLabel);
  const pageBusy = loading || secondaryLoading || submitPending;
  const submitBusy = submitDisabled || pageBusy;

  return (
    <header className="flex shrink-0 flex-col gap-[12px] border-b border-subtle bg-bg-raised px-[16px] py-[12px] sm:flex-row sm:items-center sm:justify-between sm:gap-[16px] sm:px-[24px] sm:py-[16px]">
      <div className="flex min-w-0 items-center gap-[12px]">
        <Button
          aria-label={backAriaLabel}
          className="shrink-0"
          disabled={pageBusy}
          onClick={onBack}
          size="icon-md"
          variant="outline"
        >
          <ArrowLeftIcon aria-hidden className="text-fg-secondary" weight="bold" />
        </Button>
        <Typography className="min-w-0 truncate text-fg-default" fontWeight="semibold" variant="h6">
          {title}
        </Typography>
        {pageBusy ? (
          <CircleNotchIcon
            aria-hidden
            className="size-[20px] shrink-0 animate-spin text-fg-primary"
            weight="regular"
          />
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-[8px]">
        {onDiscard ? (
          <Button
            className="min-w-0 flex-1 sm:flex-none"
            disabled={pageBusy}
            onClick={onDiscard}
            size="md"
            variant="outline"
          >
            {discardLabel}
          </Button>
        ) : null}
        {showSecondary ? (
          <Button
            className="min-w-0 flex-1 sm:flex-none"
            disabled={secondaryDisabled || pageBusy}
            leftIcon={
              secondaryLoading ? (
                <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
              ) : undefined
            }
            onClick={onSecondary}
            size="md"
            type="button"
            variant="outline"
          >
            {secondaryLabel}
          </Button>
        ) : null}
        <Button
          aria-busy={submitPending || loading}
          className="min-w-0 flex-1 sm:flex-none"
          disabled={submitBusy}
          form={submitForm}
          leftIcon={
            submitPending || loading ? (
              <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
            ) : undefined
          }
          size="md"
          type="submit"
        >
          {submitLabel}
        </Button>
      </div>
    </header>
  );
}
