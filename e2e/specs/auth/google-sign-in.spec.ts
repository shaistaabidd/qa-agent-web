import { expect, test } from '../../fixtures';
import { publicFeatureFlagsResponse } from '../../fixtures/featureFlags';
import { GraphqlFailure } from '../../fixtures/graphql';
import { buildUser } from '../../fixtures/mockUsers';

// saas-api runs the Google redirect, so the app only links to the API's /auth/google and later
// trades the one-time code from /auth/google/callback#code=… (with this tab's nonce) for a session.
const API_GOOGLE_START = /\/auth\/google\?nonce=/;
const NONCE_KEY = 'google_sign_in_nonce';
const NONCE_TTL_MS = 10 * 60 * 1000;

test.describe('Sign in with Google', () => {
  test('log in and sign up offer Google while it is on, and not while it is off', async ({
    loginPage,
    mockApi,
    page,
  }) => {
    const googleButton = page.getByRole('button', { name: 'Continue with Google' });
    await loginPage.goto();
    await expect(googleButton).toBeVisible();

    await page.goto('/signup');
    await expect(googleButton).toBeVisible();

    await mockApi({
      FetchPublicFeatureFlags: () => publicFeatureFlagsResponse({ googleSignInEnabled: false }),
    });
    await loginPage.goto();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(googleButton).toBeHidden();
  });

  test('the button sends the browser to the API with a fresh nonce and no Google settings', async ({
    loginPage,
    page,
  }) => {
    let startUrl: URL | undefined;
    await page.route(API_GOOGLE_START, async (route) => {
      startUrl = new URL(route.request().url());
      await route.fulfill({ body: '<p>Google</p>', contentType: 'text/html' });
    });
    await loginPage.goto();
    const nonceBefore = await page.evaluate((key) => sessionStorage.getItem(key), NONCE_KEY);

    await page.getByRole('button', { name: 'Continue with Google' }).click();

    await expect(page.getByText('Google')).toBeVisible();
    expect(startUrl?.pathname).toBe('/auth/google');
    expect([...(startUrl?.searchParams.keys() ?? [])]).toEqual(['nonce']);
    const nonce = startUrl?.searchParams.get('nonce');
    expect(nonce).toMatch(/^[0-9a-f-]{36}$/);

    // Back on the app's origin: the nonce it sent is the one this tab kept.
    await page.goBack();
    await loginPage.expectPath('/login');
    expect(nonceBefore).toBeNull();
    const stored = await page.evaluate((key) => sessionStorage.getItem(key), NONCE_KEY);
    expect(JSON.parse(stored ?? 'null')).toMatchObject({ nonce, at: expect.any(Number) });
  });

  test('still starts on an insecure origin where crypto.randomUUID is missing', async ({
    loginPage,
    page,
  }) => {
    let startUrl: URL | undefined;
    await page.addInitScript(() => {
      Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
    });
    await page.route(API_GOOGLE_START, async (route) => {
      startUrl = new URL(route.request().url());
      await route.fulfill({ body: '<p>Google</p>', contentType: 'text/html' });
    });
    await loginPage.goto();

    await loginPage.googleButton.click();

    await expect(page.getByText('Google')).toBeVisible();
    expect(startUrl?.searchParams.get('nonce')).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );

    await page.goBack();
    await loginPage.expectPath('/login');
    await expect(loginPage.googleButton).toBeEnabled();
  });

  test('a failed start shows a toast and leaves the button enabled', async ({
    loginPage,
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
      Object.defineProperty(crypto, 'getRandomValues', {
        value: () => {
          throw new Error('no entropy');
        },
        configurable: true,
      });
    });
    await loginPage.goto();

    await loginPage.googleButton.click();

    await loginPage.expectToast("We couldn't start Google sign-in. Please try again.");
    await expect(loginPage.googleButton).toBeEnabled();
    await expect(loginPage.googleButton).not.toHaveAttribute('aria-busy', 'true');
  });

  test('the callback trades the code and nonce for a session and leaves the code out of the URL', async ({
    loginPage,
    mockApi,
    page,
  }) => {
    const user = buildUser('super_admin');
    const mock = await mockApi({
      SignInWithGoogle: () => ({ signInWithGoogle: { token: 'e2e-google-token', user } }),
    });
    await page.addInitScript(
      ([key, at]) => sessionStorage.setItem(key, JSON.stringify({ nonce: 'tab-nonce', at })),
      [NONCE_KEY, Date.now()] as const,
    );

    await page.goto('/auth/google/callback#code=one-time-code');

    await loginPage.expectPath('/projects');
    expect(mock.callsTo('SignInWithGoogle')[0]?.variables).toEqual({
      code: 'one-time-code',
      nonce: 'tab-nonce',
    });
    expect(new URL(page.url()).hash).toBe('');
  });

  test('a refusal from the API shows its message and returns to log in', async ({
    loginPage,
    mockApi,
    page,
  }) => {
    await mockApi({
      SignInWithGoogle: () =>
        new GraphqlFailure(
          'New accounts are not being accepted right now. Please try again later.',
        ),
    });
    await page.addInitScript(
      ([key, at]) => sessionStorage.setItem(key, JSON.stringify({ nonce: 'tab-nonce', at })),
      [NONCE_KEY, Date.now()] as const,
    );

    await page.goto('/auth/google/callback#code=one-time-code');

    await loginPage.expectPath('/login');
    await loginPage.expectToast(
      'New accounts are not being accepted right now. Please try again later.',
    );
  });

  test('a callback opened without this tab’s nonce does not call the API', async ({
    loginPage,
    mockApi,
    page,
  }) => {
    const mock = await mockApi({});

    await page.goto('/auth/google/callback#code=forwarded-code');

    await loginPage.expectPath('/login');
    await loginPage.expectToast('This Google sign-in has expired. Please try again.');
    expect(mock.callsTo('SignInWithGoogle')).toHaveLength(0);
  });

  test('a nonce from an abandoned attempt is not accepted after the TTL and is cleared', async ({
    loginPage,
    mockApi,
    page,
  }) => {
    const mock = await mockApi({});
    await page.addInitScript(
      ([key, at]) => sessionStorage.setItem(key, JSON.stringify({ nonce: 'old-nonce', at })),
      [NONCE_KEY, Date.now() - NONCE_TTL_MS - 1000] as const,
    );

    await page.goto('/auth/google/callback#code=one-time-code');

    await loginPage.expectPath('/login');
    await loginPage.expectToast('This Google sign-in has expired. Please try again.');
    expect(mock.callsTo('SignInWithGoogle')).toHaveLength(0);
    expect(await page.evaluate((key) => sessionStorage.getItem(key), NONCE_KEY)).toBeNull();
  });

  test('a new attempt replaces the nonce left by an abandoned one', async ({ loginPage, page }) => {
    await page.route(API_GOOGLE_START, (route) =>
      route.fulfill({ body: '<p>Google</p>', contentType: 'text/html' }),
    );
    await loginPage.goto();
    await loginPage.googleButton.click();
    await expect(page.getByText('Google')).toBeVisible();
    await page.goBack();
    await loginPage.expectPath('/login');
    const first = await page.evaluate((key) => sessionStorage.getItem(key), NONCE_KEY);

    await loginPage.googleButton.click();
    await expect(page.getByText('Google')).toBeVisible();
    await page.goBack();

    const second = await page.evaluate((key) => sessionStorage.getItem(key), NONCE_KEY);
    expect(second).not.toBeNull();
    expect(JSON.parse(second ?? '').nonce).not.toBe(JSON.parse(first ?? '').nonce);
  });

  test.describe('after Google sign-in', () => {
    const user = buildUser('super_admin');

    async function signInWithGoogleFrom(
      startPath: string,
      { mockApi, page }: Pick<Parameters<Parameters<typeof test>[2]>[0], 'mockApi' | 'page'>,
    ) {
      await mockApi({
        SignInWithGoogle: () => ({ signInWithGoogle: { token: 'e2e-google-token', user } }),
      });
      await page.route(API_GOOGLE_START, (route) =>
        route.fulfill({ body: '<p>Google</p>', contentType: 'text/html' }),
      );
      await page.goto(startPath);
      await page.getByRole('button', { name: 'Continue with Google' }).click();
      await expect(page.getByText('Google')).toBeVisible();
      await page.goto('/auth/google/callback#code=one-time-code');
    }

    test('log in keeps the ?redirect= deep link', async ({ loginPage, mockApi, page }) => {
      await signInWithGoogleFrom('/login?redirect=%2Fsettings', { mockApi, page });

      await loginPage.expectPath('/settings');
    });

    test('sign up keeps the ?redirect= deep link', async ({ loginPage, mockApi, page }) => {
      await signInWithGoogleFrom('/signup?redirect=%2Fsettings', { mockApi, page });

      await loginPage.expectPath('/settings');
    });

    for (const unsafe of ['', '?redirect=https%3A%2F%2Fevil.com', '?redirect=%2F%2Fevil.com']) {
      test(`ignores a missing or unsafe redirect (${unsafe || 'none'})`, async ({
        loginPage,
        mockApi,
        page,
      }) => {
        await signInWithGoogleFrom(`/login${unsafe}`, { mockApi, page });

        await loginPage.expectPath('/projects');
      });
    }
  });
});
