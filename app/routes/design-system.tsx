import { DesignSystemPage } from '@/features/design-system';

import type { Route } from './+types/design-system';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Design System | QA Agent' },
    {
      name: 'description',
      content: 'QA Agent design system',
    },
  ];
}

export default function DesignSystem() {
  return <DesignSystemPage />;
}
