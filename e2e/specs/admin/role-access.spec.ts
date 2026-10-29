import { test } from '../../fixtures';
import { LEGACY_ROLE_SETUP_REDIRECT } from '../../fixtures/legacyRoles';
import { buildUser, type MockRole } from '../../fixtures/mockUsers';

type Access = {
  allowed: string[];
  blocked: string[];
  fixme?: string;
  role: MockRole;
};

// Admin pages need super_admin or team_member. /email-logs, /sms-logs and /co-admin need super_admin.
const ACCESS: Access[] = [
  {
    allowed: ['/dashboard', '/settings', '/resources', '/crud'],
    blocked: ['/co-admin', '/email-logs', '/sms-logs'],
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    role: 'team_member',
  },
  {
    allowed: ['/dashboard', '/settings', '/email-logs', '/sms-logs', '/co-admin'],
    blocked: [],
    role: 'super_admin',
  },
  {
    allowed: ['/dashboard', '/settings'],
    blocked: ['/email-logs', '/sms-logs', '/resources', '/crud', '/co-admin'],
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    role: 'client',
  },
  {
    allowed: ['/dashboard', '/settings'],
    blocked: ['/email-logs', '/sms-logs', '/crud', '/co-admin'],
    fixme: LEGACY_ROLE_SETUP_REDIRECT,
    role: 'practitioner',
  },
  {
    allowed: ['/dashboard', '/settings'],
    blocked: ['/email-logs', '/sms-logs', '/resources', '/crud', '/co-admin'],
    role: 'user',
  },
];

test.describe('Page access by user type', () => {
  for (const { allowed, blocked, fixme, role } of ACCESS) {
    for (const path of allowed) {
      test(`${role} can open ${path}`, async ({ appShell, session }) => {
        test.fixme(Boolean(fixme), fixme);
        await session.signInAs(buildUser(role));

        await appShell.open(path);

        await appShell.expectOnPage(path);
      });
    }

    for (const path of blocked) {
      test(`${role} gets "Page not found" on ${path}`, async ({ appShell, session }) => {
        test.fixme(Boolean(fixme), fixme);
        await session.signInAs(buildUser(role));

        await appShell.open(path);

        await appShell.expectNotFound();
      });
    }
  }
});
