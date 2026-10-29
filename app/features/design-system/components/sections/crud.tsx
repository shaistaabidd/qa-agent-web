import { useCallback, useMemo, useRef, useState } from 'react';

import { Button } from '@/shared/ui/button';
import type { CrudColumn, CrudFieldDef, CrudPageParams, CrudTab } from '@/shared/ui/crud';
import { CrudScreen } from '@/shared/ui/crud';

type Post = {
  id: string;
  title: string;
  body: string;
  status: 'active' | 'archived';
};

const FIELDS: CrudFieldDef[] = [
  { name: 'title', label: 'Title', required: true, maxLength: 120 },
  { name: 'body', label: 'Body', type: 'textarea', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ],
  },
];

const COLUMNS: CrudColumn<Post>[] = [
  {
    key: 'title',
    header: 'Title',
    sortable: true,
    pairWith: 'status',
    className: 'max-w-[14rem] truncate font-medium',
  },
  {
    key: 'body',
    header: 'Body',
    render: (row) => (
      <span className="line-clamp-2 max-w-md break-words whitespace-normal text-fg-secondary">
        {row.body}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    mobileLabel: 'Status',
    sortable: true,
    render: (row) => (row.status === 'archived' ? 'Archived' : 'Active'),
  },
];

const TABS: CrudTab[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
];

const SEED: Post[] = [
  {
    id: '1',
    title: 'Clinic onboarding',
    body: 'Collect account details before the first order.',
    status: 'active',
  },
  {
    id: '2',
    title: 'License review',
    body: 'Confirm licensed states before the account goes live.',
    status: 'active',
  },
  {
    id: '3',
    title: 'Payment retry',
    body: 'Retry failed subscription charges from the billing page.',
    status: 'archived',
  },
  {
    id: '4',
    title: 'Invite staff',
    body: 'Send setup links to new team members.',
    status: 'active',
  },
  {
    id: '5',
    title: 'Email logs',
    body: 'Search outbound mail by status and date.',
    status: 'active',
  },
  {
    id: '6',
    title: 'Old checklist',
    body: 'Retired steps from the first onboarding draft.',
    status: 'archived',
  },
];

function sortPosts(items: Post[], params: CrudPageParams) {
  if (!params.sort) return items;
  const direction = params.sort.order === 'asc' ? 1 : -1;
  return [...items].sort((left, right) => {
    const leftValue = String(left[params.sort!.field as keyof Post] ?? '');
    const rightValue = String(right[params.sort!.field as keyof Post] ?? '');
    return leftValue.localeCompare(rightValue) * direction;
  });
}

export function CrudScreenDemo() {
  const posts = useRef<Post[]>(SEED);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const filters = useMemo(() => ({ featured: featuredOnly }), [featuredOnly]);

  const fetchPage = useCallback(async (params: CrudPageParams) => {
    const query = params.search.trim().toLowerCase();
    let items = posts.current.filter((post) => {
      if (params.tab && params.tab !== 'all' && post.status !== params.tab) return false;
      if (params.filters.featured === true && Number(post.id) % 2 !== 0) return false;
      if (!query) return true;
      return `${post.title} ${post.body}`.toLowerCase().includes(query);
    });
    items = sortPosts(items, params);
    const start = (params.page - 1) * params.pageSize;
    return { items: items.slice(start, start + params.pageSize), totalCount: items.length };
  }, []);

  return (
    <CrudScreen<Post>
      columns={COLUMNS}
      create={{
        title: 'Add post',
        fields: FIELDS,
        initialValues: { status: 'active' },
        onSubmit: async (values) => {
          const post: Post = {
            id: String(Date.now()),
            title: values.title.trim(),
            body: values.body.trim(),
            status: values.status === 'archived' ? 'archived' : 'active',
          };
          posts.current = [post, ...posts.current];
          return post;
        },
      }}
      delete={{
        getTitle: (row) => `Delete “${row.title}”?`,
        getDescription: () => 'The row is removed from this demo list.',
        onDelete: async (row) => {
          posts.current = posts.current.filter((post) => post.id !== row.id);
        },
      }}
      description="Search, tabs, a toolbar filter, page size, sort, and add, edit, and delete."
      edit={{
        title: 'Edit post',
        fields: FIELDS,
        onSubmit: async (values, row) => {
          const post: Post = {
            ...row,
            title: values.title.trim(),
            body: values.body.trim(),
            status: values.status === 'archived' ? 'archived' : 'active',
          };
          posts.current = posts.current.map((item) => (item.id === row.id ? post : item));
          return post;
        },
      }}
      empty={{ title: 'No posts', description: 'Create one to get started.' }}
      entityLabel="post"
      fetchPage={fetchPage}
      filters={filters}
      getRowId={(post) => post.id}
      initialTab="all"
      pageSize={5}
      pageSizeOptions={[5, 10, 20]}
      search={{ placeholder: 'Search posts…' }}
      tabs={TABS}
      title="Posts"
      toolbar={
        <Button
          aria-pressed={featuredOnly}
          onClick={() => setFeaturedOnly((value) => !value)}
          size="sm"
          type="button"
          variant={featuredOnly ? 'default' : 'outline'}
        >
          {featuredOnly ? 'Featured only' : 'All IDs'}
        </Button>
      }
    />
  );
}
