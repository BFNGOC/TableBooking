import removeAccents from 'remove-accents';

export function normalizeSearch(text: string): string {
  return removeAccents(text).trim().toLowerCase().replace(/\s+/g, ' ');
}
