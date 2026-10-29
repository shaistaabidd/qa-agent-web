import { test } from '../../fixtures';
import { buildUser, type MockRole } from '../../fixtures/mockUsers';

type Access = {
  allowed: string[];
  blocked: string[];
  role: MockRole;
};

// /email-logs, /sms-logs and /co-admin need super_admin.
const ACCESS: Access[] = [
  {
    allowed: ['/dashboard', '/settings', '/email-logs', '/sms-logs', '/co-admin'],
    blocked: [],
    role: 'super_admin',
  },
  {
    allowed: ['/dashboard', '/settings'],
    blocked: ['/email-logs', '/sms-logs', '/co-admin'],
    role: 'user',
  },
];

test.describe('Page access by user type', () => {
  for (const { allowed, blocked, role } of ACCESS) {
    for (const path of allowed) {
      test(`${role} can open ${path}`, async ({ appShell, session }) => {
        await session.signInAs(buildUser(role));

        await appShell.open(path);

        await appShell.expectOnPage(path);
      });
    }

    for (const path of blocked) {
      test(`${role} gets "Page not found" on ${path}`, async ({ appShell, session }) => {
        await session.signInAs(buildUser(role));

        await appShell.open(path);

        await appShell.expectNotFound();
      });
    }
  }
});
