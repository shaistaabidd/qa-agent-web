export function getVisiblePages(page: number, pageCount: number): Array<number | '...'> {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages: Array<number | '...'> = [1];

  if (page > 3) {
    pages.push('...');
  }

  for (let value = Math.max(2, page - 1); value <= Math.min(pageCount - 1, page + 1); value += 1) {
    pages.push(value);
  }

  if (page < pageCount - 2) {
    pages.push('...');
  }

  pages.push(pageCount);
  return pages;
}
