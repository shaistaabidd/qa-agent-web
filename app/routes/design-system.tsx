import { DesignSystemPage } from '@/features/design-system';

import type { Route } from './+types/design-system';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Design System | SaaS Temp' },
    {
      name: 'description',
      content: 'SaaS Temp design system',
    },
  ];
}

export default function DesignSystem() {
  return <DesignSystemPage />;
}
