import { ArticleIcon } from '@phosphor-icons/react/Article';
import { KeyIcon } from '@phosphor-icons/react/Key';
import { useState } from 'react';

import { Button } from '@/shared/ui/button';

import { ChangePasswordDialog } from './ChangePasswordDialog';
import { SettingsGroup } from './SettingsGroup';
import { SettingsListItem } from './SettingsRow';

type SecurityTabProps = {
  changePassword: (payload: { currentPassword: string; password: string }) => Promise<void>;
};

export function SecurityTab({ changePassword }: SecurityTabProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <>
      <SettingsGroup icon={<ArticleIcon aria-hidden weight="regular" />} title="Security">
        <SettingsListItem
          actions={
            <Button onClick={() => setPasswordOpen(true)} size="sm" type="button" variant="outline">
              Change Password
            </Button>
          }
          description="Use a strong password you don't use anywhere else."
          icon={<KeyIcon aria-hidden weight="regular" />}
          title="Password"
        />
      </SettingsGroup>

      {passwordOpen ? (
        <ChangePasswordDialog
          onOpenChange={setPasswordOpen}
          onSave={async (value) => {
            await changePassword(value);
            setPasswordOpen(false);
          }}
          open
        />
      ) : null}
    </>
  );
}
