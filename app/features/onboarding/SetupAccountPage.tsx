import { RouteLoadingScreen } from '@/shell/RouteLoadingScreen';

import { useAcceptInviteMutation } from './hooks/useAcceptInviteMutation';
import { InviteSetupForm } from './InviteSetupForm';

export function SetupAccountPage() {
  const { isPending, isValidating, submit } = useAcceptInviteMutation();

  if (isValidating) {
    return <RouteLoadingScreen />;
  }

  return <InviteSetupForm isPending={isPending} onSubmit={submit} />;
}
