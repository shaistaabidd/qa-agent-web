import { EmailLogsPage } from '@/features/email-logs';

import type { Route } from './+types/email-logs';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Email Logs | QA Agent' },
    {
      name: 'description',
      content: 'Review emails sent from the platform.',
    },
  ];
}

export default function EmailLogs() {
  return <EmailLogsPage />;
}
