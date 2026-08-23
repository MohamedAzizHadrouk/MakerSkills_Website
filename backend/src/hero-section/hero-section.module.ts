import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroSection, HeroSectionSchema } from './entities/hero-section.entity';
import { HeroSectionService } from './hero-section.service';
import { HeroSectionController } from './hero-section.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HeroSection.name, schema: HeroSectionSchema },
    ]),
  ],
  controllers: [HeroSectionController],
  providers: [HeroSectionService],
})
export class HeroSectionModule {}
