import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';
import { Link } from 'react-router';

import { LOGIN_PATH } from '@/features/auth';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';

import type { Route } from './+types/invite-expired';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Invite Expired | SaaS Temp' },
    {
      name: 'description',
      content: 'This invitation link is invalid or has expired.',
    },
  ];
}

export default function InviteExpired() {
  return (
    <EmptyState
      icon={<WarningCircleIcon aria-hidden className="size-full" weight="duotone" />}
      subheading="Ask your admin to send a new invitation, then try again."
      title="This invite link is invalid or has expired"
    >
      <Button asChild size="xl" variant="default">
        <Link to={LOGIN_PATH}>Back to login</Link>
      </Button>
    </EmptyState>
  );
}
