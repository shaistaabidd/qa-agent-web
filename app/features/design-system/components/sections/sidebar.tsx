import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Avatar } from '@/shared/ui/avatar';
import {
  Sidebar,
  SIDEBAR_ICON_NAMES,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarIcon,
  type SidebarIconName,
  SidebarInset,
  SidebarLogo,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/shared/ui/sidebar';
import { Typography } from '@/shared/ui/Typography';

const NAV_ITEMS: {
  count?: number;
  icon: SidebarIconName;
  id: string;
  label: string;
}[] = [
  { icon: 'dashboard', id: 'dashboard', label: 'Dashboard' },
  { icon: 'prescription', id: 'treatment-plans', label: 'Plans' },
  { count: 24, icon: 'orders', id: 'orders', label: 'Orders' },
  { count: 24, icon: 'products', id: 'products', label: 'Products' },
  { icon: 'refill', id: 'refills', label: 'Refills' },
  { icon: 'sig', id: 'sig-templates', label: 'SIG Templates' },
  { icon: 'patients', id: 'patients', label: 'Users' },
];

const FOOTER_ITEMS: { icon: SidebarIconName; id: string; label: string }[] = [
  { icon: 'contact', id: 'support', label: 'Contact Support' },
  { icon: 'settings', id: 'settings', label: 'Settings' },
  { icon: 'logout', id: 'logout', label: 'Logout' },
];

function MenuButton({
  count,
  icon,
  isActive = false,
  label,
  onClick,
}: {
  count?: number;
  icon: SidebarIconName;
  isActive?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <SidebarMenuButton isActive={isActive} onClick={onClick} tooltip={label}>
      <SidebarIcon active={isActive} name={icon} />
      <span data-slot="sidebar-menu-label">{label}</span>
      {count != null ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
    </SidebarMenuButton>
  );
}

function Profile() {
  return (
    <div className="flex items-center gap-[12px] px-[16px] py-[8px] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-[16px]">
      <Avatar alt="Sara Kruger" size="40" src="/images/avatar/female.png" />
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <Typography
          as="p"
          className="truncate text-fg-default"
          fontWeight="semibold"
          variant="body2"
        >
          Sara Kruger
        </Typography>
        <Typography as="p" className="truncate text-fg-secondary" variant="caption">
          Admin
        </Typography>
      </div>
    </div>
  );
}

function AppSidebar({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <Sidebar collapsible="icon">
      <div className="flex min-h-0 flex-1 flex-col">
        <SidebarHeader>
          <SidebarLogo />
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarSeparator />
        <Profile />
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <MenuButton
                  icon="dashboard"
                  isActive={activeId === 'dashboard'}
                  label="Dashboard"
                  onClick={() => onSelect('dashboard')}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            <SidebarMenu>
              {NAV_ITEMS.slice(1, 6).map((item) => (
                <SidebarMenuItem key={item.id}>
                  <MenuButton
                    count={item.count}
                    icon={item.icon}
                    isActive={activeId === item.id}
                    label={item.label}
                    onClick={() => onSelect(item.id)}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Users</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <MenuButton
                  icon="patients"
                  isActive={activeId === 'patients'}
                  label="Users"
                  onClick={() => onSelect('patients')}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </div>
      <SidebarFooter>
        <SidebarMenu>
          {FOOTER_ITEMS.map((item) => (
            <SidebarMenuItem key={item.id}>
              <MenuButton
                icon={item.icon}
                isActive={activeId === item.id}
                label={item.label}
                onClick={() => onSelect(item.id)}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AppShellExample() {
  const [activeId, setActiveId] = useState('patients');

  return (
    <div
      className={[
        'relative h-[480px] w-full overflow-hidden rounded-[12px] border border-subtle',
        // Sidebar uses fixed + h-svh; keep the demo pinned inside this frame.
        '[transform:translateZ(0)]',
        '[&_[data-slot=sidebar-container]]:absolute [&_[data-slot=sidebar-container]]:h-full',
      ].join(' ')}
    >
      <SidebarProvider className="h-full min-h-0!">
        <AppSidebar activeId={activeId} onSelect={setActiveId} />
        <SidebarInset>
          <div className="flex items-center gap-[8px] border-b border-subtle bg-bg-raised p-[16px] md:hidden">
            <SidebarTrigger />
            <Typography fontWeight="semibold" variant="body2">
              Menu
            </Typography>
          </div>
          <div className="flex flex-1 flex-col gap-[12px] p-[24px]">
            <Typography fontWeight="semibold" variant="h6">
              {NAV_ITEMS.concat(FOOTER_ITEMS).find((item) => item.id === activeId)?.label ??
                'Overview'}
            </Typography>
            <Typography className="text-fg-secondary" variant="body3">
              Click a sidebar item to change the active state. Icons switch to the duotone active
              treatment from Figma.
            </Typography>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function ItemStatesExample() {
  return (
    <div className="flex w-full max-w-[260px] flex-col rounded-[12px] border border-subtle bg-bg-raised p-[16px]">
      <SidebarMenu>
        <SidebarMenuItem>
          <MenuButton icon="dashboard" label="Dashboard" />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <MenuButton count={24} icon="orders" label="Orders" />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <MenuButton icon="patients" isActive label="Users" />
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

function IconStatesExample() {
  return (
    <div className="grid w-full grid-cols-2 gap-[12px] sm:grid-cols-3 md:grid-cols-4">
      {SIDEBAR_ICON_NAMES.map((name) => (
        <div
          className="flex flex-col items-center gap-[8px] rounded-[8px] border border-subtle bg-bg-raised p-[12px]"
          key={name}
        >
          <div className="flex items-center gap-[12px]">
            <SidebarIcon name={name} />
            <SidebarIcon active name={name} />
          </div>
          <Typography className="capitalize text-fg-secondary" variant="caption">
            {name}
          </Typography>
        </div>
      ))}
    </div>
  );
}

export function SidebarSection() {
  return (
    <ComponentSection
      description="Collapsible app navigation with grouped items, count badges, and Phosphor icons that switch to the Figma active treatment."
      id="sidebar"
      title="Sidebar"
    >
      <Example
        contentClassName="w-full p-0"
        description="Logo, profile, grouped links, and footer. Users starts selected. The nav list uses the custom scrollbar when it overflows."
        title="App sidebar"
      >
        <AppShellExample />
      </Example>
      <Example
        description="Default, count badge, and selected. Hover uses the slate fill and low border from Figma."
        title="Item states"
      >
        <ItemStatesExample />
      </Example>
      <Example
        contentClassName="w-full"
        description="Regular weight in medium icon color, duotone active with amber fill and blue stroke."
        title="Icon states"
      >
        <IconStatesExample />
      </Example>
    </ComponentSection>
  );
}
