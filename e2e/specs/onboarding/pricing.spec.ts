import { expect, test } from '../../fixtures';
import { LEGACY_ROLE_SETUP_REDIRECT } from '../../fixtures/legacyRoles';
import { buildClinic } from '../../fixtures/mockClinic';
import { buildUser } from '../../fixtures/mockUsers';

const UNPAID_OWNER = buildUser('super_clinic_admin', { subscriptionPaid: false });

test.describe('Pricing', () => {
  test.fixme(true, LEGACY_ROLE_SETUP_REDIRECT);

  test('a FunctionRx clinic sees the assessment based prices', async ({ pricingPage, session }) => {
    await session.signInAs(UNPAID_OWNER, {
      FetchClinic: () => ({ fetchClinic: buildClinic('function_rx_service') }),
    });

    await pricingPage.expectLoaded();
    await pricingPage.expectItem('Base Price', '$500/mo');
    await pricingPage.expectItem('Assessment Price', '$100');
    await pricingPage.expectItem('Re-Evaluation', '$60');
    await pricingPage.expectNoItem('Max. Sequence Limit');
  });

  test('a self service clinic sees the sequence limit prices', async ({ pricingPage, session }) => {
    await session.signInAs(UNPAID_OWNER, {
      FetchClinic: () => ({ fetchClinic: buildClinic('self_service') }),
    });

    await pricingPage.expectLoaded();
    await pricingPage.expectItem('Base Price', '$500/mo');
    await pricingPage.expectItem('Max. Sequence Limit', '50');
    await pricingPage.expectNoItem('Assessment Price');
  });

  test('continuing starts checkout with return links back to the app', async ({
    paymentResultPage,
    pricingPage,
    session,
  }) => {
    const mock = await session.signInAs(UNPAID_OWNER, {
      CreateSubscriptionCheckout: () => ({
        createSubscriptionCheckout: { checkoutUrl: '/payment-failed?from=checkout' },
      }),
      FetchClinic: () => ({ fetchClinic: buildClinic('function_rx_service') }),
    });
    await pricingPage.expectLoaded();

    await pricingPage.continueToPayment();

    await paymentResultPage.expectFailed();
    const [call] = mock.callsTo('CreateSubscriptionCheckout');
    expect(String(call?.variables.successUrl)).toContain('/payment-success?');
    expect(String(call?.variables.successUrl)).toContain('serviceType=function_rx_service');
    expect(String(call?.variables.cancelUrl)).toContain('/payment-failed?');
  });

  test('a checkout without a link shows an error and stays on pricing', async ({
    pricingPage,
    session,
  }) => {
    await session.signInAs(UNPAID_OWNER, {
      CreateSubscriptionCheckout: () => ({ createSubscriptionCheckout: { checkoutUrl: null } }),
      FetchClinic: () => ({ fetchClinic: buildClinic('function_rx_service') }),
    });
    await pricingPage.expectLoaded();

    await pricingPage.continueToPayment();

    await pricingPage.expectToast('Unable to start checkout. Please try again.');
    await pricingPage.expectPath('/pricing');
  });
});
