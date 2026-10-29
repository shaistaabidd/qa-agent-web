import { expect, test } from '../../fixtures';
import { buildUser } from '../../fixtures/mockUsers';
import { onboarding } from '../../fixtures/onboarding';

const NEW_USER = buildUser('user', {
  firstName: '',
  fullName: '',
  lastName: '',
  onboarding: onboarding({ step1: ['firstName', 'lastName'], step2: ['phone'] }),
  phone: null,
});

// The API answers each saved step with the user's new onboarding status.
const afterName = buildUser('user', {
  firstName: 'Grace',
  fullName: 'Grace Hopper',
  lastName: 'Hopper',
  onboarding: onboarding({ step2: ['phone'] }),
  phone: null,
});
const afterPhone = buildUser('user', {
  firstName: 'Grace',
  fullName: 'Grace Hopper',
  lastName: 'Hopper',
});

test.describe('Onboarding steps', () => {
  // Names that are inherited object members, empty, or just wrong must not read as a known step.
  for (const unknown of ['step3', 'constructor', 'toString', '__proto__', 'STEP1', '']) {
    test(`an unknown step ${JSON.stringify(unknown)} keeps an unfinished user out of the dashboard`, async ({
      appShell,
      onboardingPage,
      session,
    }) => {
      const known = onboarding({ step1: ['firstName', 'lastName'], step2: ['phone'] });
      await session.signInAs({
        ...NEW_USER,
        onboarding: { ...known, currentStep: unknown as typeof known.currentStep },
      });
      await onboardingPage.expectOnStep('step1', 1);

      for (const path of ['/dashboard', '/settings', '/onboarding/step-2']) {
        await appShell.open(path);
        await onboardingPage.expectOnStep('step1', 1);
      }
    });
  }

  test('an unknown step goes to the first known step that is still incomplete', async ({
    onboardingPage,
    session,
  }) => {
    const known = onboarding({ step2: ['phone'] });
    await session.signInAs({
      ...NEW_USER,
      onboarding: { ...known, currentStep: 'step3' as typeof known.currentStep },
    });

    await onboardingPage.expectOnStep('step2', 2);
  });

  test('a new user starts at step 1 and is told what is missing', async ({
    onboardingPage,
    session,
  }) => {
    await session.signInAs(NEW_USER);

    await onboardingPage.expectOnStep('step1', 1);
    await onboardingPage.expectMissing('Add your first name and last name to continue.');
  });

  test('saving step 1 moves to step 2, and saving step 2 opens the dashboard', async ({
    dashboardPage,
    onboardingPage,
    session,
  }) => {
    const answers = [afterName, afterPhone];
    const mock = await session.signInAs(NEW_USER, {
      SaveOnboardingStep: () => ({ updateUser: { user: answers.shift() } }),
    });
    await onboardingPage.expectOnStep('step1', 1);

    await onboardingPage.saveName('Grace', 'Hopper');
    await onboardingPage.expectOnStep('step2', 2);
    await onboardingPage.expectStepDone('Your name');
    await onboardingPage.savePhone('2015550123');

    await dashboardPage.expectPersonalView();
    expect(mock.callsTo('SaveOnboardingStep').map((call) => call.variables)).toEqual([
      { attributes: { firstName: 'Grace', lastName: 'Hopper' } },
      { attributes: { phone: '+12015550123' } },
    ]);
  });

  for (const [label, name] of [
    ['an oversized', 'A'.repeat(51)],
    ['an HTML', '<b>Grace</b>'],
  ]) {
    test(`step 1 rejects ${label} name and sends no request`, async ({
      onboardingPage,
      session,
    }) => {
      const mock = await session.signInAs(NEW_USER);
      await onboardingPage.expectOnStep('step1', 1);

      await onboardingPage.saveName(name, 'Hopper');

      await onboardingPage.expectOnStep('step1', 1);
      await expect(onboardingPage.firstName).toHaveAttribute('aria-invalid', 'true');
      expect(mock.callsTo('SaveOnboardingStep')).toHaveLength(0);
    });
  }

  test('a double click on Next and on Finish each send one save', async ({
    dashboardPage,
    onboardingPage,
    session,
  }) => {
    const answers = [afterName, afterPhone];
    const mock = await session.signInAs(NEW_USER, {
      SaveOnboardingStep: () => ({ updateUser: { user: answers.shift() } }),
    });
    await onboardingPage.expectOnStep('step1', 1);

    await onboardingPage.firstName.fill('Grace');
    await onboardingPage.lastName.fill('Hopper');
    await onboardingPage.doubleClickNext();
    await onboardingPage.expectOnStep('step2', 2);
    expect(mock.callsTo('SaveOnboardingStep')).toHaveLength(1);

    await onboardingPage.phone.fill('2015550123');
    await onboardingPage.doubleClickFinish();
    await dashboardPage.expectPersonalView();
    expect(mock.callsTo('SaveOnboardingStep')).toHaveLength(2);
  });

  test('a user with step 1 done goes straight to step 2', async ({ onboardingPage, session }) => {
    await session.signInAs(
      buildUser('user', { onboarding: onboarding({ step2: ['phone'] }), phone: null }),
    );

    await onboardingPage.expectOnStep('step2', 2);
    await onboardingPage.expectMissing('Add your phone number to continue.');
  });

  test('an unfinished user lands on their step right after login, not the dashboard', async ({
    onboardingPage,
    session,
  }) => {
    const user = buildUser('user', { onboarding: onboarding({ step2: ['phone'] }), phone: null });

    await session.signInAs(user, { FetchUser: () => ({ fetchUser: user }) });

    await onboardingPage.expectOnStep('step2', 2);
  });

  test('steps go in order: a missing name comes first even when the phone is saved', async ({
    onboardingPage,
    session,
  }) => {
    await session.signInAs(
      buildUser('user', { lastName: '', onboarding: onboarding({ step1: ['lastName'] }) }),
    );

    await onboardingPage.expectOnStep('step1', 1);
    await onboardingPage.expectMissing('Add your last name to continue.');
  });

  test('the app sends an unfinished user back to their step', async ({
    appShell,
    onboardingPage,
    session,
  }) => {
    await session.signInAs(
      buildUser('user', { onboarding: onboarding({ step2: ['phone'] }), phone: null }),
    );

    await appShell.open('/dashboard');

    await onboardingPage.expectOnStep('step2', 2);
  });

  test('a finished user can no longer open an onboarding step', async ({
    appShell,
    dashboardPage,
    session,
  }) => {
    await session.signInAs(buildUser('user'));

    await appShell.open('/onboarding/step-1');

    await dashboardPage.expectPersonalView();
  });

  test('Back on step 2 returns to step 1 with the saved name, and Next comes back', async ({
    onboardingPage,
    session,
  }) => {
    const user = buildUser('user', {
      firstName: 'Grace',
      lastName: 'Hopper',
      onboarding: onboarding({ step2: ['phone'] }),
      phone: null,
    });
    const mock = await session.signInAs(user, {
      SaveOnboardingStep: () => ({ updateUser: { user } }),
    });
    await onboardingPage.expectOnStep('step2', 2);

    await onboardingPage.backLink.click();
    await onboardingPage.expectOnStep('step1', 1);
    await expect(onboardingPage.firstName).toHaveValue('Grace');
    await expect(onboardingPage.lastName).toHaveValue('Hopper');

    await onboardingPage.saveName('Grace', 'Hopper-Lovelace');
    await onboardingPage.expectOnStep('step2', 2);
    expect(mock.callsTo('SaveOnboardingStep')[0]?.variables).toEqual({
      attributes: { firstName: 'Grace', lastName: 'Hopper-Lovelace' },
    });
  });

  test('a later step stays locked while an earlier one is missing', async ({
    appShell,
    onboardingPage,
    session,
  }) => {
    await session.signInAs(
      buildUser('user', {
        lastName: '',
        onboarding: onboarding({ step1: ['lastName'], step2: ['phone'] }),
        phone: null,
      }),
    );

    await appShell.open('/onboarding/step-2');

    await onboardingPage.expectOnStep('step1', 1);
  });
});
