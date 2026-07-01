export interface PaginationOptions {
  current?: number;
  pageSize?: number;
}

export interface PaginationResult {
  current: number;
  pageSize: number;
  skip: number;
}

export function buildPagination({
  current = 1,
  pageSize = 10,
}: PaginationOptions): PaginationResult {
  const page = Math.max(1, Number(current) || 1);
  const limit = Math.max(1, Number(pageSize) || 10);

  return {
    current: page,
    pageSize: limit,
    skip: (page - 1) * limit,
  };
}
