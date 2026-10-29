import { test } from '../../fixtures';
import { LEGACY_ROLE_SETUP_REDIRECT } from '../../fixtures/legacyRoles';
import { buildUser, type MockRole, type MockUser } from '../../fixtures/mockUsers';

type Case = {
  expectedPath: string;
  fixme?: string;
  name: string;
  overrides?: Partial<MockUser>;
  role: MockRole;
};

// Mirrors getNextRequiredStep: onboarding, then subscription, then document, then calendar.
const CASES: Case[] = [
  {
    expectedPath: '/profile-setup',
    name: 'a client who has not finished onboarding',
    overrides: { onboardingCompleted: false },
    role: 'client',
  },
  {
    expectedPath: '/pricing',
    name: 'a clinic owner who has not paid',
    overrides: { subscriptionPaid: false },
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    role: 'super_clinic_admin',
  },
  {
    expectedPath: '/sign-document',
    name: 'a clinic owner who has not signed the document',
    overrides: { documentSigned: false },
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    role: 'super_clinic_admin',
  },
  {
    expectedPath: '/add-calendar',
    name: 'a practitioner without a calendar link',
    overrides: { calendarLink: null },
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    role: 'practitioner',
  },
  {
    expectedPath: '/dashboard',
    name: 'a fully set up practitioner',
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    role: 'practitioner',
  },
  {
    expectedPath: '/dashboard',
    name: 'a fully set up client',
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    role: 'client',
  },
  {
    expectedPath: '/dashboard',
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    name: 'a team member',
    role: 'team_member',
  },
  {
    expectedPath: '/dashboard',
    name: 'a super admin, who skips onboarding',
    overrides: { onboardingCompleted: false },
    role: 'super_admin',
  },
  {
    expectedPath: '/dashboard',
    name: 'a user, who skips onboarding',
    overrides: { onboardingCompleted: false },
    role: 'user',
  },
];

test.describe('Where a user lands after signing in', () => {
  for (const { expectedPath, fixme, name, overrides, role } of CASES) {
    test(`${name} lands on ${expectedPath}`, async ({ appShell, session }) => {
      test.fixme(Boolean(fixme), fixme);
      await session.signInAs(buildUser(role, overrides));

      await appShell.expectPath(expectedPath);
    });
  }
});
