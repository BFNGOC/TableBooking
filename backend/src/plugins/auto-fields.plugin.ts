import { Query, Schema } from 'mongoose';
import { normalizeSearch } from '../helpers/normalize-search.helper';
import { createSlug } from '../helpers/slug.helper';

interface AutoFieldsPluginOptions {
  search?: string[];
  slug?: string[];
}

export function AutoFieldsPlugin(
  schema: Schema,
  options: AutoFieldsPluginOptions,
): void {
  const searchFields = options.search ?? [];
  const slugFields = options.slug ?? [];

  /**
   * Create
   */
  schema.pre('save', function () {
    for (const field of searchFields) {
      const value = this.get(field);

      if (typeof value === 'string') {
        this.set(`${field}Search`, normalizeSearch(value));
      }
    }

    for (const field of slugFields) {
      const value = this.get(field);

      if (typeof value === 'string') {
        this.set('slug', createSlug(value));
      }
    }
  });

  /**
   * Update
   */
  const updateHook = function (this: Query<unknown, unknown>) {
    const update = this.getUpdate();

    if (!update || Array.isArray(update)) {
      return;
    }

    const data = update as Record<string, unknown>;

    for (const field of searchFields) {
      const value = data[field];

      if (typeof value === 'string') {
        data[`${field}Search`] = normalizeSearch(value);
      }
    }

    for (const field of slugFields) {
      const value = data[field];

      if (typeof value === 'string') {
        data.slug = createSlug(value);
      }
    }
  };

  schema.pre('findOneAndUpdate', updateHook);
  schema.pre('updateOne', updateHook);
}
