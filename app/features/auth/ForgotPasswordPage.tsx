import { ForgotPasswordForm } from './ForgotPasswordForm';
import { useForgotPasswordMutation } from './hooks/useForgotPasswordMutation';

export function ForgotPasswordPage() {
  const { isPending, submit } = useForgotPasswordMutation();

  return <ForgotPasswordForm isPending={isPending} onSubmit={submit} />;
}
