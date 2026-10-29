import { useCanManage, useProject } from '@/features/projects';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderText,
  CardTitle,
} from '@/shared/ui/card';

import { RoleCredentialsTable } from './components/RoleCredentialsTable';
import { SetCredentialForm } from './components/SetCredentialForm';
import { useRoleCredentials } from './hooks/useRoleCredentials';

export function CredentialsPage() {
  const project = useProject();
  const canManage = useCanManage(project);
  const { credentials, error, loading } = useRoleCredentials(project.id);

  return (
    <Card>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Role credentials</CardTitle>
          <CardDescription>
            Set once per role, such as admin. The value is encrypted and never shown again: only
            which roles have one.
          </CardDescription>
        </CardHeaderText>
      </CardHeader>
      <CardContent className="flex flex-col gap-[24px]">
        {error ? (
          <p className="text-error">{error.message || 'Unable to load credentials.'}</p>
        ) : (
          <RoleCredentialsTable credentials={credentials} loading={loading} />
        )}
        {canManage ? (
          <SetCredentialForm projectId={project.id} />
        ) : (
          <p className="text-fg-secondary">Only project admins can set credentials.</p>
        )}
      </CardContent>
    </Card>
  );
}
