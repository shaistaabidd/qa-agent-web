import { Pagination } from '@/shared/ui/pagination';

type TanStackTablePaginationProps = {
  itemLabel: string;
  label?: string;
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
  showingFrom: number;
  showingTo: number;
  total: number;
};

export function TanStackTablePagination(props: TanStackTablePaginationProps) {
  return <Pagination {...props} className="border-t border-subtle" />;
}
