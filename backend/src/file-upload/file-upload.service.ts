// file-upload.service.ts
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  async ensureDirectoryExists(directoryPath: string) {
    try {
      console.log('path ', directoryPath);
      await fs.access(directoryPath);
    } catch {
      await fs.mkdir(directoryPath, { recursive: true });
    }
  }
}
