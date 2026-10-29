import { FormInput } from '@/shared/lib/FormInput';
import { firstNameSchema, lastNameSchema } from '@/shared/lib/schemas';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

import type { CoAdminFormApi } from '../hooks/useCoAdminForm';

export function CoAdminFormFields({ email, form }: { email: string; form: CoAdminFormApi }) {
  return (
    <>
      <div className="grid gap-[16px] sm:grid-cols-2">
        <FormInput
          form={form}
          label="First name"
          name="firstName"
          required
          validate={firstNameSchema}
        />
        <FormInput
          form={form}
          label="Last name"
          name="lastName"
          required
          validate={lastNameSchema}
        />
      </div>

      {/* The email is the login, so only the user can change it. */}
      <div className="flex flex-col gap-[8px]">
        <Label bold htmlFor="co-admin-email">
          Email
        </Label>
        <Input disabled id="co-admin-email" readOnly value={email} />
      </div>
    </>
  );
}
