import slugifyLib from 'slugify';
import { Model, isValidObjectId } from 'mongoose';

export function slugifyText(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: 'fr',
  });
}

export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let candidate = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(candidate)) {
    counter++;
    candidate = `${baseSlug}-${counter}`;
  }
  return candidate;
}

export async function generateUniqueSlug(
  model: Model<any>,
  sourceText: string,
  excludeId?: string,
): Promise<string> {
  const baseSlug = slugifyText(sourceText) || 'item';
  const query: Record<string, unknown> = {
    $or: [{ slug: baseSlug }, { slug: new RegExp(`^${escapeRegex(baseSlug)}(-\\d+)?$`) }],
  };
  if (excludeId && isValidObjectId(excludeId)) {
    query._id = { $ne: excludeId };
  }

  const existing = await model.find(query).select('slug').lean().exec();
  const existingSlugs = existing
    .map((doc) => (doc as { slug?: string }).slug)
    .filter(Boolean) as string[];
  return ensureUniqueSlug(baseSlug, existingSlugs);
}

export function buildSlugLookupQuery(param: string): Record<string, unknown> {
  if (isValidObjectId(param)) {
    return { _id: param };
  }
  return {
    $or: [{ slug: param }, { previousSlugs: param }],
  };
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function assignSlugOnCreate(
  model: Model<any>,
  sourceText: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!data.slug) {
    data.slug = await generateUniqueSlug(model, sourceText);
  }
}

export async function assignSlugOnUpdate(
  model: Model<any>,
  id: string,
  existing: Record<string, unknown>,
  updateDto: Record<string, unknown>,
  titleField: 'name' | 'title',
): Promise<void> {
  const newTitle = updateDto[titleField];
  const currentTitle = existing[titleField];
  if (typeof newTitle === 'string' && newTitle !== currentTitle) {
    const oldSlug = existing.slug;
    const newSlug = await generateUniqueSlug(model, newTitle, id);
    updateDto.slug = newSlug;
    if (oldSlug && oldSlug !== newSlug) {
      updateDto.previousSlugs = [
        ...((existing.previousSlugs as string[] | undefined) || []),
        oldSlug as string,
      ];
    }
  }
}
