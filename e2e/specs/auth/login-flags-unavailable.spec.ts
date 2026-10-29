import { expect, test } from '../../fixtures';
import { GraphqlAbort } from '../../fixtures/graphql';

test.describe('Log in when the public feature flags cannot be fetched', () => {
  test('shows the form with Google and sign-up hidden, and does not stay on the splash', async ({
    loginPage,
    mockApi,
  }) => {
    const api = await mockApi({ FetchPublicFeatureFlags: () => new GraphqlAbort() });

    await loginPage.goto();

    await loginPage.expectLoadedWithSafeDefaults();
    expect(api.callsTo('FetchPublicFeatureFlags').length).toBeGreaterThan(0);
  });
});
