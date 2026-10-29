import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { FormInput } from '@/shared/lib/FormInput';
import { getMessageString } from '@/shared/lib/getMessageString';
import { Alert, AlertDescription } from '@/shared/ui/alert';
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
import { toast } from '@/shared/ui/toast';

import { projectPath } from '../constants';
import { useCreateProject } from '../hooks/useCreateProject';
import { projectNameSchema, targetUrlSchema } from '../schemas';

type CreateProjectDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const EMPTY = { name: '', targetUrl: '' };

export function CreateProjectDialog({ onOpenChange, open }: CreateProjectDialogProps) {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: EMPTY,
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      try {
        const project = await createProject({
          name: value.name.trim(),
          targetUrl: value.targetUrl.trim(),
        });
        toast.success('Project created');
        handleOpenChange(false);
        navigate(projectPath(project.id));
      } catch (error) {
        setSubmitError(getMessageString(error, 'Could not create the project. Please try again.'));
      }
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset(EMPTY);
      setSubmitError(null);
    }
    onOpenChange(next);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
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
              <DialogTitle>New project</DialogTitle>
              <DialogDescription>
                A project is one app to test, with its repository, credentials and runs.
              </DialogDescription>
            </DialogHeaderText>
          </DialogHeader>
          <DialogBody>
            {submitError ? (
              <Alert variant="error">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            ) : null}
            <FormInput form={form} label="Name" name="name" required validate={projectNameSchema} />
            <FormInput
              form={form}
              inputMode="url"
              label="Staging target URL"
              name="targetUrl"
              placeholder="https://staging.example.com"
              required
              validate={targetUrlSchema}
            />
          </DialogBody>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <DialogFooter>
                <DialogFooterActions>
                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleOpenChange(false)}
                    size="md"
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogFooterActions>
                <DialogFooterActions>
                  <Button disabled={isSubmitting} size="md" type="submit">
                    {isSubmitting ? 'Creating…' : 'Create project'}
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
