import { featureFlags } from './featureFlags';
import { onboarding } from './onboarding';

export type MockRole = 'super_admin' | 'user';

const text = null as string | null;

// Every field the login and user queries select. A missing one makes Apollo log "Missing field"
// warnings. `__typename` lets Apollo merge a saved user into the cached copy, like a real response.
const UNSET_FIELDS = {
  __typename: 'User',
  archived: false,
  createdAt: text,
  imageUrl: text,
  invitationPending: false,
  invitationSentAt: text,
  lastSignInAt: text,
  revokeAccess: false,
  unconfirmedEmail: text,
};

export type MockUser = typeof UNSET_FIELDS & {
  email: string;
  featureFlags: ReturnType<typeof featureFlags>;
  firstName: string;
  fullName: string;
  id: string;
  lastName: string;
  onboarding: ReturnType<typeof onboarding>;
  phone: string | null;
  userType: MockRole;
};

/** A user with every onboarding step done. Override a field to put them mid-setup. */
export function buildUser(role: MockRole, overrides: Partial<MockUser> = {}): MockUser {
  return {
    ...UNSET_FIELDS,
    email: `e2e+${role}@example.test`,
    featureFlags: featureFlags(),
    firstName: 'E2E',
    fullName: `E2E ${role}`,
    id: `e2e-${role}`,
    lastName: role,
    onboarding: onboarding(),
    phone: '+12015550123',
    userType: role,
    ...overrides,
  };
}
