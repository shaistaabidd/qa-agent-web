import { expect, test } from '../../fixtures';
import { LEGACY_ROLE_SETUP_REDIRECT } from '../../fixtures/legacyRoles';
import { buildFetchedUser, buildUser } from '../../fixtures/mockUsers';

const UNPAID_OWNER = buildUser('super_clinic_admin', { subscriptionPaid: false });
const BILLING_QUERY = '?serviceType=function_rx_service&basePrice=500&assessmentPrice=100';

test.describe('Payment result', () => {
  test.fixme(true, LEGACY_ROLE_SETUP_REDIRECT);

  test('the success page lists the plan from the return link', async ({
    paymentResultPage,
    session,
  }) => {
    await session.signInAs(UNPAID_OWNER);

    await paymentResultPage.openSuccess(BILLING_QUERY);

    await paymentResultPage.expectSuccess();
    await paymentResultPage.expectBillingItem('Base Price', '$500/mo');
    await paymentResultPage.expectBillingItem('Assessment Price', '$100');
  });

  test('continuing is refused until the payment is confirmed', async ({
    paymentResultPage,
    session,
  }) => {
    await session.signInAs(UNPAID_OWNER, {
      FetchUser: () => ({
        fetchUser: buildFetchedUser('super_clinic_admin', { subscriptionPaid: false }),
      }),
    });
    await paymentResultPage.openSuccess(BILLING_QUERY);
    await paymentResultPage.expectSuccess();

    await paymentResultPage.dashboardButton.click();

    await paymentResultPage.expectToast(
      'We have not received your payment yet. Please try again in a moment.',
    );
    await paymentResultPage.expectPath('/payment-success');
  });

  test('continuing goes to the dashboard once the payment is confirmed', async ({
    appShell,
    paymentResultPage,
    session,
  }) => {
    const mock = await session.signInAs(UNPAID_OWNER, {
      FetchUser: () => ({ fetchUser: buildFetchedUser('super_clinic_admin') }),
    });
    await paymentResultPage.openSuccess(BILLING_QUERY);
    await paymentResultPage.expectSuccess();

    await paymentResultPage.dashboardButton.click();

    await appShell.expectPath('/dashboard');
    const [call] = mock.callsTo('FetchUser');
    expect(call?.variables).toMatchObject({ fetchUserId: 'e2e-super_clinic_admin' });
  });

  test('the failure page offers another attempt', async ({ paymentResultPage, session }) => {
    const mock = await session.signInAs(UNPAID_OWNER, {
      CreateSubscriptionCheckout: () => ({
        createSubscriptionCheckout: { checkoutUrl: '/pricing' },
      }),
      FetchClinic: () => ({ fetchClinic: null }),
    });

    await paymentResultPage.openFailed(BILLING_QUERY);
    await paymentResultPage.expectFailed();
    await paymentResultPage.tryAgainButton.click();

    await paymentResultPage.expectPath('/pricing');
    expect(mock.callsTo('CreateSubscriptionCheckout')).toHaveLength(1);
  });
});
