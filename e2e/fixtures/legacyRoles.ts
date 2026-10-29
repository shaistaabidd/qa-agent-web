/**
 * The login query no longer selects onboardingCompleted, subscriptionPaid, documentSigned or
 * calendarLink, so every role except super_admin and user is sent to /profile-setup after sign-in.
 * Remove the fixme on the cases that use this once those fields come back.
 */
export const LEGACY_ROLE_SETUP_REDIRECT =
  'The login query no longer fetches the setup fields, so this role is sent to /profile-setup.';
