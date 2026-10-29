import type { Route } from './+types/set-password';
import SetupAccount, { meta as setupMeta } from './setup-account';

export const meta = setupMeta;

export default function SetPassword(_props: Route.ComponentProps) {
  return <SetupAccount />;
}
