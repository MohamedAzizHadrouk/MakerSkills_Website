import { PartialType } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  BadRequestException,
  UseInterceptors,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/project.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('coverImage', 1, {
      storage: diskStorage({
        destination: './uploads/projects',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() imageFile: Express.Multer.File,
  ) {
    // Parse the stringified arrays
    if (typeof createProjectDto.technologies === 'string') {
      createProjectDto.technologies = JSON.parse(createProjectDto.technologies);
    }

    if (typeof createProjectDto.categories === 'string') {
      createProjectDto.categories = JSON.parse(createProjectDto.categories);
    }

    if (imageFile) {
      createProjectDto.coverImage = `/uploads/projects/${imageFile[0].filename}`;
    }

    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) updateProjectDto: UpdateProjectDto,
  ) {
    // Parse stringified fields
    if (typeof updateProjectDto?.technologies === 'string') {
      try {
        updateProjectDto.technologies = JSON.parse(updateProjectDto.technologies);
      } catch (e) {
        throw new BadRequestException('Invalid JSON format for technologies');
      }
    }
    if (typeof updateProjectDto?.categories === 'string') {
      try {
        updateProjectDto.categories = JSON.parse(updateProjectDto.categories);
      } catch (e) {
        throw new BadRequestException('Invalid JSON format for categories');
      }
    }
    console.log('updateProjectDto:', updateProjectDto);
    console.log('id:', id);
    return this.projectsService.update(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
