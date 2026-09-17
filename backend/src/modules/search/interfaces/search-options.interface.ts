export interface SearchSort {
  field: string;
  order: 'asc' | 'desc';
}

export interface SearchOptions {
  keyword?: string;

  fields: string[];

  filter?: Record<string, unknown>;

  from?: number;

  size?: number;

  sort?: SearchSort[];
}
