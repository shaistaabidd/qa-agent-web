import { LockOpenIcon } from '@phosphor-icons/react/LockOpen';
import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';
import { AuthMessagePanel } from '@/shell/auth';

type PasswordResetSuccessProps = {
  loginTo?: string;
};

export function PasswordResetSuccess({ loginTo = '/login' }: PasswordResetSuccessProps) {
  return (
    <AuthMessagePanel
      action={
        <Button asChild className="w-full">
          <Link to={loginTo}>Log in now</Link>
        </Button>
      }
      description="Your password has been successfully reset. You can now sign in with your new password."
      icon={<LockOpenIcon aria-hidden size={28} weight="regular" />}
      title="Password Reset Successfully"
    />
  );
}
