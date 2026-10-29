import { CheckCircleIcon } from '@phosphor-icons/react/CheckCircle';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';
import { useSearchParams } from 'react-router';

import { clinicBillingFromSearchParams, getBillingItems } from '@/features/onboarding/billingData';
import { useConfirmSubscription } from '@/features/onboarding/hooks/useConfirmSubscription';
import { useCreateSubscriptionCheckout } from '@/features/onboarding/hooks/useCreateSubscriptionCheckout';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';
import { AuthMessagePanel } from '@/shell/auth';

type PaymentResultPanelProps = {
  success: boolean;
};

export function PaymentResultPanel({ success }: PaymentResultPanelProps) {
  const [searchParams] = useSearchParams();
  const { confirmSubscription, loading: confirming } = useConfirmSubscription();
  const { loading: checkoutLoading, startCheckout } = useCreateSubscriptionCheckout();

  const clinic = clinicBillingFromSearchParams(searchParams);
  const billingItems = getBillingItems(clinic);

  return (
    <AuthMessagePanel
      action={
        success ? (
          <Button
            className="w-full"
            disabled={confirming}
            onClick={() => void confirmSubscription()}
            size="xl"
            type="button"
            variant="default"
          >
            {confirming ? (
              <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
            ) : null}
            Go to Dashboard
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={checkoutLoading}
            onClick={() => void startCheckout(clinic)}
            size="xl"
            type="button"
            variant="default"
          >
            {checkoutLoading ? (
              <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
            ) : null}
            Try Again
          </Button>
        )
      }
      description="Here's the details"
      icon={
        success ? (
          <CheckCircleIcon aria-hidden size={28} weight="regular" />
        ) : (
          <WarningCircleIcon aria-hidden size={28} weight="regular" />
        )
      }
      notice={
        <ul className="flex w-full flex-col gap-[12px] rounded-[12px] border border-low bg-surface-white p-[16px]">
          {billingItems.map((item) => (
            <li className="flex items-start justify-between gap-[12px]" key={item.id}>
              <Typography className="text-medium" variant="body3">
                {item.title}
              </Typography>
              <Typography className="shrink-0 text-high" fontWeight="medium" variant="body3">
                {item.detail}
              </Typography>
            </li>
          ))}
        </ul>
      }
      title={success ? 'Payment successful!' : 'Payment failed'}
    />
  );
}
