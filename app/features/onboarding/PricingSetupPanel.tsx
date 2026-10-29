import { useQuery } from '@apollo/client/react';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { InfoIcon } from '@phosphor-icons/react/Info';

import {
  type ClinicBilling,
  getBillingItems,
  serviceTypeDescription,
} from '@/features/onboarding/billingData';
import { useCreateSubscriptionCheckout } from '@/features/onboarding/hooks/useCreateSubscriptionCheckout';
import { FETCH_CLINIC } from '@/graphql/queries/clinicQueries';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipProvider } from '@/shared/ui/tooltip';
import { Typography } from '@/shared/ui/Typography';
import { AuthScreenHeader } from '@/shell/auth';

type FetchClinicData = {
  fetchClinic?: ClinicBilling | null;
};

export function PricingSetupPanel() {
  const { data, loading: clinicLoading } = useQuery(FETCH_CLINIC);
  const { loading: checkoutLoading, startCheckout } = useCreateSubscriptionCheckout();

  const clinic = (data as FetchClinicData | undefined)?.fetchClinic ?? {};
  const billingItems = getBillingItems(clinic);
  const isPending = clinicLoading || checkoutLoading;

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <AuthScreenHeader
        description="Choose a plan to activate your clinic subscription."
        title="Pricing"
      />

      {clinicLoading ? (
        <div className="flex justify-center py-[32px]">
          <CircleNotchIcon aria-hidden className="size-[24px] animate-spin text-medium" />
        </div>
      ) : (
        <div className="flex flex-col gap-[16px]">
          <Typography className="text-medium" variant="body2">
            {serviceTypeDescription(clinic.serviceType)}
          </Typography>

          <TooltipProvider>
            <ul className="flex flex-col gap-[16px]">
              {billingItems.map((item) => (
                <li className="flex flex-col gap-[4px]" key={item.id}>
                  <div className="flex items-center gap-[6px]">
                    <Typography className="text-medium" variant="body2">
                      {item.title}
                    </Typography>
                    <Tooltip content={item.tooltip} side="top">
                      <Button
                        aria-label={`About ${item.title}`}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <InfoIcon aria-hidden weight="regular" />
                      </Button>
                    </Tooltip>
                  </div>
                  <Typography className="text-high" variant="body1">
                    {item.detail}
                  </Typography>
                </li>
              ))}
            </ul>
          </TooltipProvider>
        </div>
      )}

      <Button
        disabled={isPending}
        onClick={() => void startCheckout(clinic)}
        size="xl"
        type="button"
        variant="default"
      >
        {checkoutLoading ? (
          <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
        ) : null}
        Continue to Payment
      </Button>
    </div>
  );
}
