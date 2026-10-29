import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { FormDropdown } from '@/shared/lib/FormDropdown';
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

import { useApprovedScopeFeatures } from '../hooks/useApprovedScopeFeatures';
import { useDispatchRun } from '../hooks/useDispatchRun';

const featureSchema = z.string().min(1, 'Choose a scope feature');
const roleSchema = z.string().trim().min(1, 'Enter the role to sign in as');

export function DispatchRunCard({ projectId }: { projectId: string }) {
  const { features } = useApprovedScopeFeatures(projectId, false);
  const dispatchRun = useDispatchRun();

  const form = useForm({
    defaultValues: { roleName: '', scopeFeatureId: '' },
    onSubmit: async ({ value }) => {
      try {
        await dispatchRun(value.scopeFeatureId, value.roleName.trim());
        toast.success('Run dispatched');
        form.reset();
      } catch (error) {
        toast.error(getMessageString(error, 'Could not dispatch the run.'));
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Dispatch a run</CardTitle>
          <CardDescription>
            The worker signs in as the role and explores the feature, then reports what it found.
          </CardDescription>
        </CardHeaderText>
      </CardHeader>
      <CardContent>
        {features.length === 0 ? (
          <p className="text-fg-secondary">
            Approve a scope feature before you can dispatch a run.
          </p>
        ) : (
          <form
            className="flex flex-col gap-[16px]"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <div className="grid gap-[16px] md:grid-cols-2">
              <FormDropdown
                form={form}
                label="Scope feature"
                name="scopeFeatureId"
                options={features.map((feature) => ({ label: feature.name, value: feature.id }))}
                placeholder="Select a feature"
                required
                validate={featureSchema}
              />
              <FormInput
                form={form}
                label="Role"
                name="roleName"
                placeholder="admin"
                required
                validate={roleSchema}
              />
            </div>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <div>
                  <Button disabled={isSubmitting} size="md" type="submit">
                    {isSubmitting ? 'Dispatching…' : 'Dispatch run'}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
