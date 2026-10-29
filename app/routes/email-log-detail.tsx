import { EmailLogDetailPage } from '@/features/email-logs';

import type { Route } from './+types/email-log-detail';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Email Log | SaaS Temp' },
    {
      name: 'description',
      content: 'Email log details.',
    },
  ];
}

export default function EmailLogDetail() {
  return <EmailLogDetailPage />;
}
