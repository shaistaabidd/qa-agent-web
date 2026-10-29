export type PaginationOptions = {
  /** Noun in “Showing 1 – 20 of 500 {itemLabel}”. Defaults to `items`. */
  itemLabel?: string;
  /** Accessible name of the pagination nav. Defaults to `Pagination`. */
  label?: string;
  pageSize?: number;
};

export type PaginationProps = {
  className?: string;
  itemLabel?: string;
  label?: string;
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
  showingFrom: number;
  showingTo: number;
  total: number;
};
