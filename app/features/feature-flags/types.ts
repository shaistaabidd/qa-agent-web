/**
 * Flags from saas-api, already resolved on the server for a user and their role. On a user they
 * describe that user: `invitationsEnabled` / `impersonationEnabled` say whether people like them
 * can be invited / impersonated, not whether they can do it to others.
 */
export type FeatureFlags = {
  emailChangeOtpEnabled: boolean;
  googleSignInEnabled: boolean;
  impersonationEnabled: boolean;
  invitationsEnabled: boolean;
  otpEnabled: boolean;
  signUpEnabled: boolean;
};

export type FeatureFlagName = keyof FeatureFlags;

/** The only flags saas-api shares with a signed-out visitor. */
export type PublicFeatureFlags = Pick<
  FeatureFlags,
  'googleSignInEnabled' | 'otpEnabled' | 'signUpEnabled'
>;

/** Roles saas-api accepts in `fetchFeatureFlags(role:)`. */
export type FeatureFlagRole = 'super_admin' | 'user';
