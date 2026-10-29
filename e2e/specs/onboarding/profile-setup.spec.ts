import { expect, test } from '../../fixtures';
import { buildClinic } from '../../fixtures/mockClinic';
import { buildUser } from '../../fixtures/mockUsers';

const PROFILE = {
  address: '1 Main Street',
  city: 'Austin',
  firstName: 'Ada',
  lastName: 'Lovelace',
  phone: '2025550123',
  state: 'TX',
  zipCode: '73301',
};

const INCOMPLETE = { onboardingCompleted: false };

test.describe('Profile setup', () => {
  test('a client sees the personal fields and no clinic fields', async ({
    profileSetupPage,
    session,
  }) => {
    await session.signInAs(buildUser('client', INCOMPLETE));

    await profileSetupPage.expectLoaded();
    await expect(profileSetupPage.firstName).toBeVisible();
    await expect(profileSetupPage.phone).toBeVisible();
    await expect(profileSetupPage.clinicName).toBeHidden();
    await expect(profileSetupPage.website).toBeHidden();
    await expect(profileSetupPage.smsConsent).toBeHidden();
  });

  test('the name is pre-filled from the account', async ({ profileSetupPage, session }) => {
    await session.signInAs(buildUser('client', { ...INCOMPLETE, firstName: 'Ada', lastName: 'L' }));

    await profileSetupPage.expectLoaded();
    await expect(profileSetupPage.firstName).toHaveValue('Ada');
    await expect(profileSetupPage.lastName).toHaveValue('L');
  });

  test('a clinic owner also sees the clinic name and website', async ({
    profileSetupPage,
    session,
  }) => {
    await session.signInAs(buildUser('super_clinic_admin', INCOMPLETE));

    await profileSetupPage.expectLoaded();
    await expect(profileSetupPage.clinicName).toBeVisible();
    await expect(profileSetupPage.website).toBeVisible();
    await expect(profileSetupPage.smsConsent).toBeVisible();
  });

  test('submitting an empty form shows the required errors and sends nothing', async ({
    profileSetupPage,
    session,
  }) => {
    const mock = await session.signInAs(
      buildUser('client', { ...INCOMPLETE, firstName: '', lastName: '', phone: null }),
    );
    await profileSetupPage.expectLoaded();

    await profileSetupPage.submit();

    // First name, last name, address, city, state and ZIP. Phone shows its own message.
    await profileSetupPage.expectRequiredErrors(6);
    await profileSetupPage.expectInvalidPhone();
    expect(mock.callsTo('ClinicOnboarding')).toHaveLength(0);
  });

  test('a client who completes the form is sent on to sign the document', async ({
    appShell,
    profileSetupPage,
    session,
  }) => {
    // The client branch only navigates with the unchanged session user, which still has
    // onboardingCompleted false, so the route guard sends it back to /profile-setup.
    test.fixme(true, 'Client profile setup saves nothing and loops back to /profile-setup.');

    await session.signInAs(buildUser('client', INCOMPLETE));
    await profileSetupPage.expectLoaded();

    await profileSetupPage.fill(PROFILE);
    await profileSetupPage.submit();

    await appShell.expectPath('/sign-document');
  });

  test('a clinic owner who completes the form is saved and sent to choose a plan', async ({
    appShell,
    profileSetupPage,
    session,
  }) => {
    const mock = await session.signInAs(buildUser('super_clinic_admin', INCOMPLETE), {
      ClinicOnboarding: () => ({
        clinicOnboarding: {
          clinic: buildClinic('self_service'),
          message: 'Clinic profile saved',
          user: buildUser('super_clinic_admin', { subscriptionPaid: false }),
        },
      }),
    });
    await profileSetupPage.expectLoaded();

    await profileSetupPage.fill(PROFILE);
    await profileSetupPage.fillClinic({ clinicName: 'Lovelace Clinic' });
    await profileSetupPage.submit();

    await appShell.expectPath('/pricing');
    const [call] = mock.callsTo('ClinicOnboarding');
    expect(call?.variables).toMatchObject({
      address: PROFILE.address,
      city: PROFILE.city,
      name: 'Lovelace Clinic',
      state: PROFILE.state,
      zip: PROFILE.zipCode,
    });
  });
});
