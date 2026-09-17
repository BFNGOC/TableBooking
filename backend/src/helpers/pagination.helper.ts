export interface PaginationOptions {
  currentPage?: number;
  pageSize?: number;
}

export interface PaginationResult {
  currentPage: number;
  pageSize: number;
  skip: number;
}

export function buildPagination({
  currentPage = 1,
  pageSize = 10,
}: PaginationOptions): PaginationResult {
  const page = Math.max(1, Number(currentPage) || 1);
  const limit = Math.max(1, Number(pageSize) || 10);

  return {
    currentPage: page,
    pageSize: limit,
    skip: (page - 1) * limit,
  };
}
