import type * as React from 'react';

import { Button } from '@/shared/ui/button';
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
import { Typography } from '@/shared/ui/Typography';

export type CrudFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  submitting?: boolean;
  error?: string | null;
  onSubmit: () => void;
  children: React.ReactNode;
};

export function CrudFormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = 'Save',
  submitting = false,
  error,
  onSubmit,
  children,
}: CrudFormDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        closeDisabled={submitting}
        closeOnEscape={!submitting}
        closeOnOutsideClick={!submitting}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <DialogHeader>
            <DialogHeaderText>
              <DialogTitle>{title}</DialogTitle>
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeaderText>
          </DialogHeader>
          <DialogBody>
            {children}
            {error ? (
              <Typography className="text-fg-danger" variant="body3">
                {error}
              </Typography>
            ) : null}
          </DialogBody>
          <DialogFooter>
            <DialogFooterActions>
              <Button
                disabled={submitting}
                onClick={() => onOpenChange(false)}
                size="md"
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogFooterActions>
            <DialogFooterActions>
              <Button disabled={submitting} size="md" type="submit">
                {submitting ? 'Saving…' : submitLabel}
              </Button>
            </DialogFooterActions>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
