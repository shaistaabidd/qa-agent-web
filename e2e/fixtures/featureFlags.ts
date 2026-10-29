export type FeatureFlagValues = {
  emailChangeOtpEnabled: boolean;
  googleSignInEnabled: boolean;
  impersonationEnabled: boolean;
  invitationsEnabled: boolean;
  otpEnabled: boolean;
  signUpEnabled: boolean;
};

/** Every spec starts with every flag on, the behavior the app had before the flags existed. */
export const ALL_FLAGS_ON: FeatureFlagValues = {
  emailChangeOtpEnabled: true,
  googleSignInEnabled: true,
  impersonationEnabled: true,
  invitationsEnabled: true,
  otpEnabled: true,
  signUpEnabled: true,
};

/** A `FeatureFlags` object as the API returns it: every flag on unless overridden. */
export function featureFlags(overrides: Partial<FeatureFlagValues> = {}) {
  return { __typename: 'FeatureFlags', ...ALL_FLAGS_ON, ...overrides };
}

/** A `FetchFeatureFlags(role:)` answer: flags for users of a role (e.g. can they be invited). */
export function featureFlagsResponse(overrides: Partial<FeatureFlagValues> = {}) {
  return { fetchFeatureFlags: featureFlags(overrides) };
}

/** A `FetchPublicFeatureFlags` answer: the flags signed-out pages may read. */
export function publicFeatureFlagsResponse(
  overrides: Partial<
    Pick<FeatureFlagValues, 'googleSignInEnabled' | 'otpEnabled' | 'signUpEnabled'>
  > = {},
) {
  const { googleSignInEnabled, otpEnabled, signUpEnabled } = { ...ALL_FLAGS_ON, ...overrides };
  return {
    fetchPublicFeatureFlags: {
      __typename: 'PublicFeatureFlags',
      googleSignInEnabled,
      otpEnabled,
      signUpEnabled,
    },
  };
}
