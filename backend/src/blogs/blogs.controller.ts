import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cover', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/blogs',
          filename: (_req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (_req, file, cb) => {
          if (file.fieldname === 'cover' || file.fieldname === 'images') {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
              return cb(new Error('Only image files are allowed!'), false);
            }
          }
          if (file.fieldname === 'video') {
            if (!file.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)) {
              return cb(new Error('Only video files are allowed!'), false);
            }
          }
          cb(null, true);
        },
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      cover?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body() createBlogDto: CreateBlogDto,
  ) {
    if (files.cover && files.cover[0]) {
      createBlogDto.cover = `/uploads/blogs/${files.cover[0].filename}`;
    }
    if (files.images && files.images.length > 0) {
      createBlogDto.images = files.images.map(
        (file) => `/uploads/blogs/${file.filename}`,
      );
    }

    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cover', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/blogs',
          filename: (_req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (_req, file, cb) => {
          if (file.fieldname === 'cover' || file.fieldname === 'images') {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
              return cb(new Error('Only image files are allowed!'), false);
            }
          }
          if (file.fieldname === 'video') {
            if (!file.originalname.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)) {
              return cb(new Error('Only video files are allowed!'), false);
            }
          }
          cb(null, true);
        },
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      cover?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    if (files.cover && files.cover[0]) {
      updateBlogDto.cover = `/uploads/blogs/${files.cover[0].filename}`;
    }
    if (files.images && files.images.length > 0) {
      updateBlogDto.images = files.images.map(
        (file) => `/uploads/blogs/${file.filename}`,
      );
    }

    return this.blogsService.update(id, updateBlogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
