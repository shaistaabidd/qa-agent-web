import { ArrowsClockwiseIcon } from '@phosphor-icons/react/ArrowsClockwise';
import { ArticleIcon } from '@phosphor-icons/react/Article';
import { BellIcon } from '@phosphor-icons/react/Bell';
import { ChatTextIcon } from '@phosphor-icons/react/ChatText';
import { ClipboardTextIcon } from '@phosphor-icons/react/ClipboardText';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/EnvelopeSimple';
import { GaugeIcon } from '@phosphor-icons/react/Gauge';
import { GearSixIcon } from '@phosphor-icons/react/GearSix';
import { HospitalIcon } from '@phosphor-icons/react/Hospital';
import type { Icon } from '@phosphor-icons/react/lib';
import { PackageIcon } from '@phosphor-icons/react/Package';
import { PillIcon } from '@phosphor-icons/react/Pill';
import { QuestionIcon } from '@phosphor-icons/react/Question';
import { SignOutIcon } from '@phosphor-icons/react/SignOut';
import { StethoscopeIcon } from '@phosphor-icons/react/Stethoscope';
import { TagIcon } from '@phosphor-icons/react/Tag';
import { UsersFourIcon } from '@phosphor-icons/react/UsersFour';

import { cn } from '@/shared/lib/utils';

import type { SidebarIconName, SidebarIconProps } from './types';

const ICONS: Record<SidebarIconName, Icon> = {
  contact: QuestionIcon,
  dashboard: GaugeIcon,
  email: EnvelopeSimpleIcon,
  sms: ChatTextIcon,
  doctors: StethoscopeIcon,
  logout: SignOutIcon,
  notifications: BellIcon,
  orders: PackageIcon,
  patients: UsersFourIcon,
  pharmacy: HospitalIcon,
  prescription: ClipboardTextIcon,
  pricing: TagIcon,
  products: PillIcon,
  refill: ArrowsClockwiseIcon,
  settings: GearSixIcon,
  sig: ArticleIcon,
};

export function SidebarIcon({ active = false, className, name }: SidebarIconProps) {
  const IconComponent = ICONS[name];

  return (
    <span
      className={cn(
        'size-[24px] shrink-0 text-fg-secondary [&_svg]:size-full',
        active &&
          'text-fg-primary [&_path[opacity="0.2"]]:fill-sidebar-icon-accent [&_path[opacity="0.2"]]:opacity-100',
        className,
      )}
      data-active={active || undefined}
      data-slot="sidebar-icon"
    >
      <IconComponent aria-hidden size={24} weight={active ? 'duotone' : 'regular'} />
    </span>
  );
}
