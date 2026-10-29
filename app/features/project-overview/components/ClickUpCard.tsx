import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { type Project, useCanManage } from '@/features/projects';
import { FormInput } from '@/shared/lib/FormInput';
import { getMessageString } from '@/shared/lib/getMessageString';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderText,
  CardTitle,
} from '@/shared/ui/card';
import { toast } from '@/shared/ui/toast';

import { useConnectClickUp } from '../hooks/useConnectClickUp';

const listIdSchema = z.string().trim().min(1, 'Enter the ClickUp list id');

export function ClickUpCard({ project }: { project: Project }) {
  const canManage = useCanManage(project);
  const connect = useConnectClickUp(project.id);

  const form = useForm({
    defaultValues: { listId: '' },
    onSubmit: async ({ value }) => {
      try {
        await connect(value.listId.trim());
        toast.success('ClickUp list connected');
        form.reset();
      } catch (error) {
        toast.error(getMessageString(error, 'Could not connect the ClickUp list.'));
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>ClickUp</CardTitle>
          <CardDescription>Findings are posted to this list as tasks.</CardDescription>
        </CardHeaderText>
      </CardHeader>
      <CardContent>
        {canManage ? (
          <form
            className="flex flex-col gap-[16px]"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FormInput form={form} label="List ID" name="listId" required validate={listIdSchema} />
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <div>
                  <Button disabled={isSubmitting} size="md" type="submit">
                    {isSubmitting ? 'Connecting…' : 'Connect'}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </form>
        ) : (
          <p className="text-fg-secondary">Only project admins can connect ClickUp.</p>
        )}
      </CardContent>
    </Card>
  );
}
