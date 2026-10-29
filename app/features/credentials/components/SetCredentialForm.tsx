import { useForm } from '@tanstack/react-form';

import { FormInput } from '@/shared/lib/FormInput';
import { getMessageString } from '@/shared/lib/getMessageString';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast';

import { useSetRoleCredential } from '../hooks/useSetRoleCredential';
import { credentialValueSchema, roleNameSchema } from '../schemas';

export function SetCredentialForm({ projectId }: { projectId: string }) {
  const setCredential = useSetRoleCredential(projectId);

  const form = useForm({
    defaultValues: { credentialValue: '', roleName: '' },
    onSubmit: async ({ value }) => {
      try {
        await setCredential(value.roleName.trim(), value.credentialValue);
        toast.success('Credential saved');
        form.reset();
      } catch (error) {
        toast.error(getMessageString(error, 'Could not save the credential.'));
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-[16px]"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="grid gap-[16px] md:grid-cols-2">
        <FormInput
          form={form}
          label="Role name"
          name="roleName"
          placeholder="admin"
          required
          validate={roleNameSchema}
        />
        <FormInput
          autoComplete="new-password"
          description='JSON like {"email":"…","password":"…"}, or email:password'
          form={form}
          label="Credential"
          name="credentialValue"
          required
          type="password"
          validate={credentialValueSchema}
        />
      </div>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div>
            <Button disabled={isSubmitting} size="md" type="submit">
              {isSubmitting ? 'Saving…' : 'Save credential'}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
