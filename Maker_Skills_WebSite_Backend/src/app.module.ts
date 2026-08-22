import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
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

// Fonction pour obtenir le chemin du dossier uploads
function getUploadsPath(): string {
  // Méthode 1: Utiliser process.cwd() qui devrait pointer vers ~/backend en production
  const cwd = process.cwd();
  let uploadsPath = resolve(cwd, 'uploads');
  
  // Si process.cwd() pointe vers dist/, remonter d'un niveau
  if (cwd.includes('dist')) {
    uploadsPath = resolve(cwd, '..', 'uploads');
  }
  
  // Vérifier si ce chemin existe
  if (existsSync(uploadsPath)) {
    return uploadsPath;
  }
  
  // Méthode 2: Utiliser __dirname pour remonter à la racine
  const currentDir = __dirname;
  if (currentDir.includes('dist')) {
    // En production: __dirname = dist
    uploadsPath = resolve(currentDir, '..', 'uploads');
  } else {
    // En développement: __dirname = src
    uploadsPath = resolve(currentDir, '..', 'uploads');
  }
  
  // Méthode 3: Chemin absolu basé sur le home directory (pour production)
  // Si on est sur Linux et que process.cwd() est dans ~/backend
  if (process.platform !== 'win32') {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    if (homeDir) {
      const homeUploadsPath = resolve(homeDir, 'backend', 'uploads');
      if (existsSync(homeUploadsPath)) {
        return homeUploadsPath;
      }
    }
  }
  
  // Par défaut, retourner le chemin basé sur process.cwd()
  return resolve(process.cwd().includes('dist') ? resolve(process.cwd(), '..') : process.cwd(), 'uploads');
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'], // Load environment variables from these files
    }),
    ServeStaticModule.forRoot({
      rootPath: getUploadsPath(),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false, // Ne pas servir index.html par défaut
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        console.log('MONGODB_USER:', "maker");
        console.log('MONGODB_PASSWORD:', "maker_skills");
        return {
          uri: `mongodb+srv://${"maker"}:${"maker_skills"}@makerskills.ad4zvlg.mongodb.net/?retryWrites=true&w=majority&appName=makerskills`,
        };
      },
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${"maker"}:${"maker_skills"}@makerskills.ad4zvlg.mongodb.net/?retryWrites=true&w=majority&appName=makerskills`,
    ),
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
    FileUploadModule,
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
