import { useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';

import { FormTextarea } from '@/shared/lib/FormTextarea';
import { getMessageString } from '@/shared/lib/getMessageString';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import type { CrudFormRenderApi } from '@/shared/ui/crud';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogFooterActions,
  DialogHeader,
  DialogHeaderText,
  DialogTitle,
} from '@/shared/ui/dialog';
import { toast } from '@/shared/ui/toast';

import { CO_ADMIN_TAB_PENDING } from '../constants';
import type { CoAdminActions } from '../hooks/useCoAdminActions';
import { inviteEmailsSchema } from '../schemas';
import type { CoAdmin, RejectedInvite } from '../types';
import { parseEmails } from '../utils';

type InviteCoAdminDialogProps = CrudFormRenderApi<CoAdmin> & {
  actions: CoAdminActions;
  /** The API refused or failed: let the page re-read the flags, since invitations may now be off. */
  onInviteFailed?: () => void;
};

export function InviteCoAdminDialog({
  actions,
  close,
  onInviteFailed,
  list,
  setTab,
  tab,
  visible,
}: InviteCoAdminDialogProps) {
  const [rejected, setRejected] = useState<RejectedInvite[]>([]);
  const form = useForm({
    defaultValues: { emails: '' },
    onSubmit: async ({ value }) => {
      try {
        const result = await actions.invite(parseEmails(value.emails));
        // A new invite is only listed under Pending Invites, so show it there.
        if (tab === CO_ADMIN_TAB_PENDING) {
          list.goToFirstPage();
          list.refetch();
        } else {
          setTab(CO_ADMIN_TAB_PENDING);
        }
        toast.success(result.message);
        if (result.rejected.length === 0) {
          setRejected([]);
          close();
          return;
        }
        // Keep only the skipped addresses so the user can fix them and resend.
        setRejected(result.rejected);
        form.setFieldValue('emails', result.rejected.map((item) => item.email).join(', '));
      } catch (error) {
        toast.error(getMessageString(error, 'Something went wrong. Please try again.'));
        onInviteFailed?.();
      }
    },
  });

  useEffect(() => {
    if (!visible) {
      form.reset({ emails: '' });
    }
  }, [form, visible]);

  function closeDialog() {
    setRejected([]);
    close();
  }

  return (
    <Dialog onOpenChange={(next) => (next ? undefined : closeDialog())} open={visible}>
      <DialogContent>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogHeaderText>
              <DialogTitle>Invite user</DialogTitle>
              <DialogDescription>
                Each person gets an email with a link to set up their account.
              </DialogDescription>
            </DialogHeaderText>
          </DialogHeader>
          <DialogBody>
            {rejected.length > 0 ? (
              <Alert variant="warning">
                <AlertTitle>These emails were not invited</AlertTitle>
                <AlertDescription>
                  {rejected.map((item) => (
                    <span className="block" key={item.email}>
                      {item.email} — {item.message}
                    </span>
                  ))}
                </AlertDescription>
              </Alert>
            ) : null}
            <FormTextarea
              form={form}
              label="Emails"
              name="emails"
              placeholder="Enter one or more emails, separated by commas or new lines"
              required
              size="md"
              validate={inviteEmailsSchema}
            />
          </DialogBody>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <DialogFooter>
                <DialogFooterActions>
                  <Button
                    disabled={isSubmitting}
                    onClick={closeDialog}
                    size="md"
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogFooterActions>
                <DialogFooterActions>
                  <Button disabled={isSubmitting} size="md" type="submit">
                    {isSubmitting ? 'Sending…' : 'Send invite'}
                  </Button>
                </DialogFooterActions>
              </DialogFooter>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
