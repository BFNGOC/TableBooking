export function buildSort(sort?: string): Record<string, 1 | -1> {
  if (!sort) {
    return {
      createdAt: -1,
    };
  }

  const field = sort.startsWith('-') ? sort.slice(1) : sort;

  return {
    [field]: sort.startsWith('-') ? -1 : 1,
  };
}
