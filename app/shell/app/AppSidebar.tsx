import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';

import { logout, toAppRole, useAuthStore } from '@/features/auth';
import { toPhotoUrl } from '@/shared/lib/photoUrl';
import { Avatar } from '@/shared/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarIcon,
  type SidebarIconName,
  SidebarLogo,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/shared/ui/sidebar';
import { Typography } from '@/shared/ui/Typography';

import { CreditsAvailable } from './components/CreditsAvailable';
import { LogoutConfirmDialog } from './components/LogoutConfirmDialog';
import { DASHBOARD_PATH, getAppNavGroups, getAppProfile, SETTINGS_PATH } from './constants';

function Profile() {
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const profile = getAppProfile(toAppRole(role), user?.name ?? user?.email);

  return (
    <div className="flex items-center gap-[12px] px-[16px] py-[8px] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-[16px]">
      <Avatar size="40" src={toPhotoUrl(user?.imageUrl) || undefined}>
        {profile.name.slice(0, 1)}
      </Avatar>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <Typography as="p" className="truncate text-fg-default" fontWeight="medium" variant="body3">
          {profile.name}
        </Typography>
        <Typography as="p" className="truncate text-fg-secondary" variant="caption">
          {profile.role}
        </Typography>
      </div>
    </div>
  );
}

function NavItemButton({
  count,
  icon,
  isActive = false,
  label,
  onClick,
  to,
}: {
  count?: number;
  icon: SidebarIconName;
  isActive?: boolean;
  label: string;
  onClick?: () => void;
  to?: string;
}) {
  const content = (
    <>
      <SidebarIcon active={isActive} name={icon} />
      <span data-slot="sidebar-menu-label">{label}</span>
      {count != null ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
    </>
  );

  if (to) {
    return (
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <NavLink prefetch="intent" to={to} viewTransition>
          {content}
        </NavLink>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton isActive={isActive} onClick={onClick} tooltip={label} type="button">
      {content}
    </SidebarMenuButton>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const settingsActive = pathname.startsWith(SETTINGS_PATH);
  const role = useAuthStore((state) => state.role);
  const appRole = toAppRole(role);
  const navGroups = getAppNavGroups(appRole)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || (role && item.roles.includes(role))),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <div className="flex min-h-0 flex-1 flex-col">
        <SidebarHeader>
          <SidebarLogo to={DASHBOARD_PATH} />
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarSeparator />
        <Profile />
        <CreditsAvailable />
        <SidebarSeparator />
        <SidebarContent>
          {navGroups.map((group) => (
            <SidebarGroup key={group.label ?? group.items[0]?.id}>
              {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.to ? pathname.startsWith(item.to) : false;

                  return (
                    <SidebarMenuItem key={item.id}>
                      <NavItemButton
                        count={item.count}
                        icon={item.icon}
                        isActive={isActive}
                        label={item.label}
                        to={item.to}
                      />
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>
      <SidebarFooter>
        <SidebarMenu>
          {appRole !== 'admin' ? (
            <SidebarMenuItem>
              <NavItemButton icon="contact" label="Contact Support" />
            </SidebarMenuItem>
          ) : null}
          <SidebarMenuItem>
            <NavItemButton
              icon="settings"
              isActive={settingsActive}
              label="Settings"
              to={SETTINGS_PATH}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <NavItemButton icon="logout" label="Logout" onClick={() => setLogoutOpen(true)} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <LogoutConfirmDialog
        onConfirm={() => logout()}
        onOpenChange={setLogoutOpen}
        open={logoutOpen}
      />
    </Sidebar>
  );
}
