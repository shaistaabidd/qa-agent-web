import { useState } from 'react';

import { ComponentSection, Example } from '@/features/design-system/components/Showcase';
import { Pagination } from '@/shared/ui/pagination';

export function PaginationSection() {
  const [page, setPage] = useState(1);
  const pageCount = 8;
  const pageSize = 20;
  const total = 148;
  const showingFrom = (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, total);

  return (
    <ComponentSection
      description="Page controls with showing X–Y of Z summary."
      id="pagination"
      title="Pagination"
    >
      <Example contentClassName="block w-full" title="Default">
        <Pagination
          onPageChange={setPage}
          page={page}
          pageCount={pageCount}
          showingFrom={showingFrom}
          showingTo={showingTo}
          total={total}
        />
      </Example>
    </ComponentSection>
  );
}
