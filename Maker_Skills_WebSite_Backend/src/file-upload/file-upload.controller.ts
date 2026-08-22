// file-upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('path') path?: string,
  ) {
    // If path is provided, ensure the directory exists
    if (path) {
      await this.fileUploadService.ensureDirectoryExists(path);
    }

    return {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      path: 'uploads/' + file.filename,
      destination: file.destination,
    };
  }
}
