import { SmsLogsPage } from '@/features/sms-logs';

import type { Route } from './+types/sms-logs';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'SMS Logs | QA Agent' },
    {
      name: 'description',
      content: 'Review text messages sent from the platform.',
    },
  ];
}

export default function SmsLogs() {
  return <SmsLogsPage />;
}
