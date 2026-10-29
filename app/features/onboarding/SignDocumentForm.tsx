import { useMutation } from '@apollo/client/react';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { useState } from 'react';

import {
  applyGraphQLSession,
  type AuthGraphQLUser,
  hardNavigateAfterAuth,
  useAuthStore,
} from '@/features/auth';
import { UPDATE_USER } from '@/graphql/mutations/userMutations';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { toast } from '@/shared/ui/toast';
import { Typography } from '@/shared/ui/Typography';
import { AuthScreenHeader } from '@/shell/auth';

export function SignDocumentForm() {
  const user = useAuthStore((state) => state.user);
  const [updateUser, { loading }] = useMutation(UPDATE_USER);
  const [acknowledged, setAcknowledged] = useState(false);

  async function complete() {
    if (!acknowledged) {
      toast.error('Please confirm you have reviewed the agreement.');
      return;
    }

    if (!user?.id) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    try {
      const result = await updateUser({
        variables: {
          documentSigned: true,
          id: user.id,
        },
      });

      const payload = result.data as {
        updateUser?: { user?: AuthGraphQLUser };
      } | null;
      const nextUser = payload?.updateUser?.user;
      const token = useAuthStore.getState().accessToken;

      if (!token) {
        toast.error('Session expired. Please log in again.');
        return;
      }

      const sessionUser = applyGraphQLSession(token, {
        ...(nextUser ?? user),
        documentSigned: true,
      });
      toast.success('Document signed');
      hardNavigateAfterAuth(sessionUser);
    } catch {
      // The Apollo error link already shows this failure.
    }
  }

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <AuthScreenHeader
        description="Review and confirm the required agreement to continue."
        title="Sign document"
      />

      <div className="rounded-[12px] border border-border-color-subtle bg-surface-subtle p-[16px]">
        <Typography className="text-medium" variant="body2">
          By continuing, you confirm that you have read and agree to the platform agreement for your
          account type.
        </Typography>
      </div>

      <Checkbox
        checked={acknowledged}
        onCheckedChange={(checked) => setAcknowledged(checked === true)}
      >
        I have reviewed and agree to the document.
      </Checkbox>

      <Button
        disabled={loading || !acknowledged}
        onClick={() => void complete()}
        size="xl"
        type="button"
        variant="default"
      >
        {loading ? <CircleNotchIcon aria-hidden className="animate-spin" /> : null}
        Confirm and continue
      </Button>
    </div>
  );
}
