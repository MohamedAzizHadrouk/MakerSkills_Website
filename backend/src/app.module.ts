import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { ServicesModule } from './services/services.module';
import { EventsModule } from './events/events.module';
import { ParticipantsModule } from './participants/participants.module';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './partners/partners.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BlogsModule } from './blogs/blogs.module';
import { HeroSectionModule } from './hero-section/hero-section.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ShopModule } from './shop/shop.module';
import { StaticModule } from './static/static.module';
import { UploadsModule } from './uploads/uploads.module';
import { LaboratoriesModule } from './laboratories/laboratories.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { getMongodbUri, getUploadsPath } from './common/config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ServeStaticModule.forRoot({
      rootPath: getUploadsPath(),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: getMongodbUri(),
      }),
    }),
    ProductsModule,
    CategoriesModule,
    ProjectsModule,
    ServicesModule,
    FileUploadModule,
    EventsModule,
    ParticipantsModule,
    AuthModule,
    PartnersModule,
    ReviewsModule,
    BlogsModule,
    HeroSectionModule,
    ShopModule,
    StaticModule,
    UploadsModule,
    LaboratoriesModule,
    SitemapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
