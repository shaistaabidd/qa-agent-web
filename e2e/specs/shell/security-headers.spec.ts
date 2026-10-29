import { expect, test } from '../../fixtures';

test.describe('Security headers', () => {
  test('every page answers with the hardening headers', async ({ appShell }) => {
    const response = await appShell.goto('/login');
    const headers = response?.headers() ?? {};

    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['strict-transport-security']).toContain('max-age=');
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['content-security-policy']).toContain("object-src 'none'");
  });

  test('the strict script policy is reported, with a fresh nonce for each response', async ({
    appShell,
  }) => {
    const first = await appShell.goto('/login');
    const second = await appShell.goto('/login');
    const nonceOf = (policy: string | undefined) => policy?.match(/'nonce-([^']+)'/)?.[1];

    const firstNonce = nonceOf(first?.headers()['content-security-policy-report-only']);
    const secondNonce = nonceOf(second?.headers()['content-security-policy-report-only']);

    expect(firstNonce).toBeTruthy();
    expect(firstNonce).not.toBe(secondNonce);
  });

  test('the page still loads and hydrates with the policy in place', async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.expectLoaded();
  });
});
