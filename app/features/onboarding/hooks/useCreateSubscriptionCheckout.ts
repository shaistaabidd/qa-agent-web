import { useMutation } from '@apollo/client/react';

import { buildPaymentUrls, type ClinicBilling } from '@/features/onboarding/billingData';
import { CREATE_SUBSCRIPTION_CHECKOUT } from '@/graphql/mutations/subscriptionMutations';
import { toast } from '@/shared/ui/toast';

type CreateSubscriptionCheckoutData = {
  createSubscriptionCheckout?: {
    checkoutUrl?: string | null;
  } | null;
};

export function useCreateSubscriptionCheckout() {
  const [createSubscriptionCheckout, { loading }] = useMutation(CREATE_SUBSCRIPTION_CHECKOUT);

  async function startCheckout(clinic: ClinicBilling) {
    const { cancelUrl, successUrl } = buildPaymentUrls(clinic);

    try {
      const result = await createSubscriptionCheckout({
        variables: { cancelUrl, successUrl },
      });

      const payload = result.data as CreateSubscriptionCheckoutData | null | undefined;
      const checkoutUrl = payload?.createSubscriptionCheckout?.checkoutUrl;

      if (!checkoutUrl) {
        toast.error('Unable to start checkout. Please try again.');
        return;
      }

      window.location.assign(checkoutUrl);
    } catch {
      // The Apollo error link already shows this failure.
    }
  }

  return { loading, startCheckout };
}
