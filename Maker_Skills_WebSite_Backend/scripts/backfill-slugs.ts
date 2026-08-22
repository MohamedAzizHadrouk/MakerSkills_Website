import mongoose from 'mongoose';
import {
  slugifyText,
  ensureUniqueSlug,
} from '../src/common/utils/slug.util';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://maker:maker_skills@makerskills.ad4zvlg.mongodb.net/?retryWrites=true&w=majority&appName=makerskills';

interface SlugDoc {
  _id: mongoose.Types.ObjectId;
  slug?: string;
  name?: string;
  title?: string;
}

async function backfillCollection(
  collectionName: string,
  titleField: 'name' | 'title',
): Promise<number> {
  const collection = mongoose.connection.collection(collectionName);
  const docs = (await collection
    .find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] })
    .toArray()) as SlugDoc[];

  const usedSlugs = new Set(
    (
      await collection
        .find({ slug: { $exists: true, $nin: [null, ''] } })
        .project({ slug: 1 })
        .toArray()
    ).map((doc: SlugDoc) => doc.slug as string),
  );

  let updated = 0;
  for (const doc of docs) {
    const sourceText = doc[titleField];
    if (!sourceText) {
      console.warn(`Skipping ${collectionName} ${doc._id}: missing ${titleField}`);
      continue;
    }

    const baseSlug = slugifyText(sourceText) || 'item';
    const slug = ensureUniqueSlug(baseSlug, Array.from(usedSlugs));
    usedSlugs.add(slug);

    await collection.updateOne({ _id: doc._id }, { $set: { slug, previousSlugs: [] } });
    updated++;
    console.log(`  ${collectionName}: ${sourceText} → ${slug}`);
  }

  return updated;
}

async function ensureIndexes(): Promise<void> {
  const collections = ['events', 'blogs', 'products', 'laboratories'];
  for (const name of collections) {
    try {
      await mongoose.connection.collection(name).createIndex(
        { slug: 1 },
        { unique: true, sparse: true },
      );
      console.log(`Index created on ${name}.slug`);
    } catch (error) {
      console.warn(`Index on ${name}.slug:`, (error as Error).message);
    }
  }
}

async function main(): Promise<void> {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const results = {
    events: await backfillCollection('events', 'name'),
    blogs: await backfillCollection('blogs', 'title'),
    products: await backfillCollection('products', 'name'),
    laboratories: await backfillCollection('laboratories', 'title'),
  };

  console.log('\nBackfill summary:', results);
  await ensureIndexes();
  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
