export function normalizeKeyword(keyword?: string): string {
  return keyword?.trim().replace(/\s+/g, ' ') ?? '';
}
