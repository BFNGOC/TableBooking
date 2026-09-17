import slugify from 'slugify';

type SlugifyOptions = {
  lower?: boolean;
  strict?: boolean;
  trim?: boolean;
  locale?: string;
};

const slugifyText: (value: string, options?: SlugifyOptions) => string =
  slugify;

export function createSlug(text: string): string {
  return slugifyText(text, {
    lower: true,
    strict: true,
    trim: true,
    locale: 'vi',
  });
}
