import { AddCalendarForm } from '@/features/onboarding';

import type { Route } from './+types/add-calendar';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Add Calendar | SaaS Temp' },
    { name: 'description', content: 'Connect your booking calendar.' },
  ];
}

export default function AddCalendar() {
  return <AddCalendarForm />;
}
