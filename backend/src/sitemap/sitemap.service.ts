import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../events/entities/event.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { Product } from '../products/entities/product.entity';
import { Laboratory } from '../laboratories/entities/laboratory.entity';

const SITE_URL =
  process.env.SITE_URL || 'https://www.makerskills.tn';

@Injectable()
export class SitemapService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Laboratory.name) private laboratoryModel: Model<Laboratory>,
  ) {}

  async generateXml(): Promise<string> {
    const staticPaths = ['/', '/services', '/academy', '/shop', '/blogs', '/lab40', '/contact', '/about'];

    const [events, blogs, products, laboratories] = await Promise.all([
      this.eventModel.find({ slug: { $exists: true, $ne: '' } }).select('slug').lean().exec(),
      this.blogModel.find({ slug: { $exists: true, $ne: '' } }).select('slug').lean().exec(),
      this.productModel.find({ slug: { $exists: true, $ne: '' } }).select('slug').lean().exec(),
      this.laboratoryModel.find({ slug: { $exists: true, $ne: '' } }).select('slug').lean().exec(),
    ]);

    const urls: { loc: string; lastmod?: string }[] = staticPaths.map((path) => ({
      loc: `${SITE_URL}${path}`,
    }));

    for (const event of events) {
      if (event.slug) {
        urls.push({ loc: `${SITE_URL}/formations/${event.slug}` });
      }
    }

    for (const blog of blogs) {
      if (blog.slug) {
        urls.push({ loc: `${SITE_URL}/blogs/${blog.slug}` });
      }
    }

    for (const product of products) {
      if (product.slug) {
        urls.push({ loc: `${SITE_URL}/shop/${product.slug}` });
      }
    }

    for (const lab of laboratories) {
      if (lab.slug) {
        urls.push({ loc: `${SITE_URL}/lab40/${lab.slug}/reservation` });
      }
    }

    const urlEntries = urls
      .map(({ loc, lastmod }) => {
        const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
        return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
  }
}
