import { Query, Schema } from 'mongoose';
import { createSlug } from '../helpers/slug.helper';

interface AutoSlugPluginOptions {
  slug?: string[];
}

export function AutoSlugPlugin(
  schema: Schema,
  options: AutoSlugPluginOptions,
): void {
  const slugFields = options.slug ?? [];

  schema.pre('save', function () {
    for (const field of slugFields) {
      const value = this.get(field);

      if (typeof value === 'string') {
        this.set('slug', createSlug(value));
      }
    }
  });

  const updateHook = function (this: Query<unknown, unknown>) {
    const update = this.getUpdate();

    if (!update || Array.isArray(update)) {
      return;
    }

    const data = update as Record<string, unknown>;

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
