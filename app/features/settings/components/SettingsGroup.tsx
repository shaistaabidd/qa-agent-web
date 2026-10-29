import type { ReactNode } from 'react';

import { GroupContainer } from '@/shared/ui/group-container';

type SettingsGroupProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
};

export function SettingsGroup({ children, icon, title }: SettingsGroupProps) {
  return (
    <GroupContainer className="w-full max-w-[600px]" icon={icon} title={title}>
      {children}
    </GroupContainer>
  );
}
