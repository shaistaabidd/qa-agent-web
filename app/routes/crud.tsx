import { CrudPage } from '@/features/design-system';

export function meta() {
  return [{ title: 'CRUD | SaaS Temp' }, { name: 'description', content: 'CRUD screen preview' }];
}

export default function Crud() {
  return <CrudPage />;
}
