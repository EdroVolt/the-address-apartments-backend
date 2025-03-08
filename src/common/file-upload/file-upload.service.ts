import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { UPLOADS_FOLDER } from '../constants';

@Injectable()
export class FileUploadService {
  constructor() {
    // Ensure uploads directory exists
    const uploadPath = join(process.cwd(), UPLOADS_FOLDER);
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
  }

  /**
   * Get the URL for an uploaded file
   * @param filename The name of the file
   * @returns The URL to access the file
   */
  getFileUrl(filename: string): string | null {
    if (!filename) return null;
    return `/${UPLOADS_FOLDER}/${filename}`;
  }

  /**
   * Generate a unique filename for an uploaded file
   * @param originalname The original name of the file
   * @returns A unique filename
   */
  generateUniqueFilename(originalname: string): string {
    const timestamp = Date.now();
    const extension = originalname.split('.').pop();
    return `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
  }
}
