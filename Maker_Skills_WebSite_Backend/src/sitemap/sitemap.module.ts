import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../events/entities/event.entity';
import { Blog, BlogSchema } from '../blogs/entities/blog.entity';
import { Product, ProductSchema } from '../products/entities/product.entity';
import { Laboratory, LaboratorySchema } from '../laboratories/entities/laboratory.entity';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Laboratory.name, schema: LaboratorySchema },
    ]),
  ],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
