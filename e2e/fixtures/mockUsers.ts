import { featureFlags } from './featureFlags';
import { onboarding } from './onboarding';

export type MockRole =
  | 'client'
  | 'clinic_admin'
  | 'practitioner'
  | 'super_admin'
  | 'super_clinic_admin'
  | 'team_member'
  | 'user';

const text = null as string | null;
const flag = null as boolean | null;

// Every field the login query selects. A missing one makes Apollo log "Missing field" warnings.
// `__typename` lets Apollo merge a saved user into the cached copy, like a real response.
const UNSET_FIELDS = {
  __typename: 'User',
  address: text,
  archived: false,
  city: text,
  clinicId: text,
  clinicImageUrl: text,
  clinicName: text,
  conditions: text,
  createdAt: text,
  dateOfBirth: text,
  deleted: false,
  gender: text,
  imageUrl: text,
  invitationPending: false,
  invitationSentAt: text,
  lastSignInAt: text,
  medicalHistory: text,
  phone: text,
  pregnancyDueDate: text,
  pregnant: flag,
  revokeAccess: false,
  smsConsent: false,
  state: text,
  surgeries: text,
  unconfirmedEmail: text,
  zipCode: text,
};

export type MockUser = typeof UNSET_FIELDS & {
  calendarLink: string | null;
  documentSigned: boolean;
  email: string;
  featureFlags: ReturnType<typeof featureFlags>;
  onboarding: ReturnType<typeof onboarding>;
  phone: string | null;
  firstName: string;
  fullName: string;
  id: string;
  lastName: string;
  onboardingCompleted: boolean;
  subscriptionPaid: boolean;
  userType: MockRole;
};

/** A user with every setup step done. Override a field to put them mid-setup. */
export function buildUser(role: MockRole, overrides: Partial<MockUser> = {}): MockUser {
  return {
    ...UNSET_FIELDS,
    calendarLink: 'https://example.test/calendar',
    documentSigned: true,
    email: `e2e+${role}@example.test`,
    featureFlags: featureFlags(),
    onboarding: onboarding(),
    phone: '+12015550123',
    firstName: 'E2E',
    fullName: `E2E ${role}`,
    id: `e2e-${role}`,
    lastName: role,
    onboardingCompleted: true,
    subscriptionPaid: true,
    userType: role,
    ...overrides,
  };
}

/** The shape the `User` query returns: the login fields plus the extras that query selects. */
export function buildFetchedUser(role: MockRole, overrides: Partial<MockUser> = {}) {
  return {
    ...buildUser(role, overrides),
    clinicTheme: null,
    maxSequenceLimit: null,
    selfServiceClinic: false,
    sequenceCount: 0,
    therapyCount: 0,
    totalClients: 0,
    usedSequenceCount: 0,
  };
}
