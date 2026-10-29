import { test } from '../../fixtures';
import { buildUser, type MockRole, type MockUser } from '../../fixtures/mockUsers';
import { onboarding } from '../../fixtures/onboarding';

type Case = {
  expectedPath: string;
  name: string;
  overrides?: Partial<MockUser>;
  role: MockRole;
};

// Mirrors getNextRequiredStep: a user finishes onboarding, in order, before the app; super admins never onboard.
const CASES: Case[] = [
  {
    expectedPath: '/onboarding/step-1',
    name: 'a user who has not given their name',
    overrides: { onboarding: onboarding({ step1: ['firstName', 'lastName'] }) },
    role: 'user',
  },
  {
    expectedPath: '/onboarding/step-2',
    name: 'a user who has not given their phone number',
    overrides: { onboarding: onboarding({ step2: ['phone'] }) },
    role: 'user',
  },
  {
    expectedPath: '/projects',
    name: 'a fully set up user',
    role: 'user',
  },
  {
    expectedPath: '/projects',
    name: 'a super admin, who skips onboarding',
    overrides: { onboarding: onboarding({ step1: ['firstName', 'lastName'] }) },
    role: 'super_admin',
  },
];

test.describe('Where a user lands after signing in', () => {
  for (const { expectedPath, name, overrides, role } of CASES) {
    test(`${name} lands on ${expectedPath}`, async ({ appShell, session }) => {
      await session.signInAs(buildUser(role, overrides));

      await appShell.expectPath(expectedPath);
    });
  }
});
