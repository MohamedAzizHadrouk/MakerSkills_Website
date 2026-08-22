import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HeroSectionService } from './hero-section.service';
import { CreateHeroSectionDto } from './dto/create-hero-section.dto';
import { UpdateHeroSectionDto } from './dto/update-hero-section.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('hero-section')
export class HeroSectionController {
  constructor(private readonly heroSectionService: HeroSectionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/hero-section',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createHeroSectionDto: CreateHeroSectionDto,
  ) {
    if (image) {
      createHeroSectionDto.image = `/uploads/hero-section/${image.filename}`;
    }
    return this.heroSectionService.create(createHeroSectionDto);
  }

  @Get()
  async findAll() {
    return this.heroSectionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.heroSectionService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/hero-section',
        filename: (_req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateHeroSectionDto: UpdateHeroSectionDto,
  ) {
    if (image) {
      updateHeroSectionDto.image = `/uploads/hero-section/${image.filename}`;
    }
    return this.heroSectionService.update(id, updateHeroSectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.heroSectionService.remove(id);
  }
}
