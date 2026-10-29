import { toAppRole, useAuthStore } from '@/features/auth';
import { toPhotoUrl } from '@/shared/lib/photoUrl';
import { Avatar } from '@/shared/ui/avatar';
import { SidebarLogo, useSidebar } from '@/shared/ui/sidebar';
import { TopBar, TopBarEnd, TopBarMenuButton, TopBarStart } from '@/shared/ui/top-bar';
import { Typography } from '@/shared/ui/Typography';

import { DASHBOARD_PATH, getAppProfile } from './constants';

export function AppMobileHeader() {
  const { toggleSidebar } = useSidebar();
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const profile = getAppProfile(toAppRole(role), user?.name ?? user?.email);

  return (
    <TopBar className="lg:hidden">
      <TopBarStart>
        <TopBarMenuButton aria-label="Open menu" onClick={toggleSidebar} />
        <SidebarLogo to={DASHBOARD_PATH} />
      </TopBarStart>
      <TopBarEnd>
        <Avatar size="32" src={toPhotoUrl(user?.imageUrl) || undefined}>
          {profile.name.slice(0, 1)}
        </Avatar>
        <Typography
          as="span"
          className="min-w-0 truncate text-fg-default"
          fontWeight="semibold"
          variant="body3"
        >
          {profile.name}
        </Typography>
      </TopBarEnd>
    </TopBar>
  );
}
