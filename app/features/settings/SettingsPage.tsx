import { CircleNotchIcon } from '@phosphor-icons/react/CircleNotch';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';

import { scrollbarClass } from '@/shared/lib/scrollbar';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { TabItem, TabPanel, Tabs } from '@/shared/ui/tabs';
import { AppPageHeader } from '@/shell/app';

import { AccountTab, SecurityTab } from './components';
import { SETTINGS_TABS } from './constants';
import { useAccountSettings, useSettingsTab } from './hooks';
import type { AccountTabValue } from './types';

export function SettingsPage() {
  const settings = useAccountSettings();
  const { profile } = settings;
  const { setTab, tab } = useSettingsTab();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppPageHeader
        description="Manage your general profile details and login email address."
        title="Account Settings"
      />
      <Tabs
        className="bg-surface-white px-[16px] md:px-[24px]"
        id="settings-tabs"
        onValueChange={(value) => setTab(value as AccountTabValue)}
        value={tab}
      >
        {SETTINGS_TABS.map((item) => (
          <TabItem key={item.value} value={item.value}>
            {item.label}
          </TabItem>
        ))}
      </Tabs>
      <TabPanel
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-y-auto p-[16px] md:p-[24px]',
          scrollbarClass,
        )}
        tabsId="settings-tabs"
        value={tab}
      >
        {settings.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <CircleNotchIcon
              aria-hidden
              className="size-[28px] animate-spin text-icon-primary"
              weight="regular"
            />
            <span className="sr-only">Loading account settings</span>
          </div>
        ) : null}
        {settings.isError ? (
          <EmptyState
            icon={<WarningCircleIcon aria-hidden weight="regular" />}
            subheading="We couldn't load your account details. Try again."
            title="Unable to load settings"
          >
            <Button
              onClick={() => {
                void settings.refetch();
              }}
              size="md"
              type="button"
            >
              Try again
            </Button>
          </EmptyState>
        ) : null}
        {profile && tab === 'account' ? (
          <AccountTab
            isPhotoPending={settings.isPhotoPending}
            onRemovePhoto={settings.removePhoto}
            onConfirmNewEmail={settings.confirmNewEmail}
            onRequestNewEmail={settings.requestNewEmail}
            onResendNewEmailCode={settings.resendNewEmailCode}
            onUploadPhoto={settings.uploadPhoto}
            profile={profile}
            updateProfile={settings.updateProfile}
          />
        ) : null}
        {profile && tab === 'security' ? (
          <SecurityTab changePassword={settings.changePassword} />
        ) : null}
      </TabPanel>
    </div>
  );
}
