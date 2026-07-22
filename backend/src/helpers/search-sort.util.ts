import { SearchSort } from '@app/modules/search/interfaces/search-options.interface';

export function parseSort(sort?: string): SearchSort[] | undefined {
  if (!sort) {
    return undefined;
  }

  const [field, order] = sort.split(':');

  if (!field) {
    return undefined;
  }

  return [
    {
      field,
      order: order?.toLowerCase() === 'desc' ? 'desc' : 'asc',
    },
  ];
}
