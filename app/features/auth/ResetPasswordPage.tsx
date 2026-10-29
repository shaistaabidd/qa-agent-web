import { useResetPasswordMutation } from './hooks/useResetPasswordMutation';
import { ResetPasswordForm } from './ResetPasswordForm';

export function ResetPasswordPage() {
  const { isPending, submit } = useResetPasswordMutation();

  return <ResetPasswordForm isPending={isPending} onSubmit={submit} />;
}
