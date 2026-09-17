import { SearchSort } from '@app/modules/search/interfaces/search-options.interface';

export function parseSort(sort?: string): SearchSort[] | undefined {
  if (!sort) {
    return undefined;
  }

  // Frontend sends values like: 'default', 'rating_desc', 'price_asc', 'price_desc'
  if (sort === 'default') return undefined;

  // Handle snake_case style from frontend (e.g. 'rating_desc', 'price_asc')
  if (sort.includes('_')) {
    const [key, dir] = sort.split('_');

    let field = key;

    // map friendly keys to actual document fields
    if (key === 'price') field = 'priceFrom';
    if (key === 'rating') field = 'rating';

    return [
      {
        field,
        order: dir?.toLowerCase() === 'desc' ? 'desc' : 'asc',
      },
    ];
  }

  // Fallback: legacy colon-separated format 'field:desc'
  const [field, order] = sort.split(':');

  if (!field) return undefined;

  return [
    {
      field,
      order: order?.toLowerCase() === 'desc' ? 'desc' : 'asc',
    },
  ];
}
