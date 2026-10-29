import { useMutation } from '@apollo/client/react';
import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import type { FormEvent } from 'react';

import { LOGOUT } from '@/graphql/mutations/authMutations';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogFooterActions,
  DialogHeader,
  DialogHeaderText,
  DialogTitle,
} from '@/shared/ui/dialog';

const REVOKE_TIMEOUT_MS = 2000;

type LogoutConfirmDialogProps = {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export function LogoutConfirmDialog({ onConfirm, onOpenChange, open }: LogoutConfirmDialogProps) {
  const [revokeSession, { loading: pending }] = useMutation(LOGOUT);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (pending) {
      return;
    }

    try {
      await revokeSession({
        context: {
          fetchOptions: { signal: AbortSignal.timeout(REVOKE_TIMEOUT_MS) },
          silentErrors: true,
        },
      });
    } catch {
      // Revoking is best effort. The local session is cleared either way.
    }

    onConfirm();
  }

  function handleOpenChange(next: boolean) {
    if (pending && !next) {
      return;
    }

    onOpenChange(next);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent
        className="max-w-[400px]"
        closeOnEscape={!pending}
        closeOnOutsideClick={!pending}
        size="md"
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogHeaderText>
              <DialogTitle>Log out?</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out of your account?
              </DialogDescription>
            </DialogHeaderText>
          </DialogHeader>
          <DialogFooter>
            <DialogFooterActions>
              <Button
                aria-busy={pending || undefined}
                disabled={pending}
                leftIcon={
                  pending ? (
                    <CircleNotchIcon aria-hidden className="animate-spin" weight="regular" />
                  ) : undefined
                }
                size="md"
                type="submit"
                variant="danger"
              >
                Log out
              </Button>
            </DialogFooterActions>
            <DialogFooterActions>
              <DialogClose asChild>
                <Button disabled={pending} size="md" type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooterActions>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
