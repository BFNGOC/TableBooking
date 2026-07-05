export function normalizeKeyword(keyword?: string): string {
  return (
    keyword
      ?.trim()
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D') ?? ''
  );
}
