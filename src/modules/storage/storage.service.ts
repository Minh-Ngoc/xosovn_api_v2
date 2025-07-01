import { FOLDER_UPLOAD_IMAGES } from '@/constants';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly folder = path.resolve(FOLDER_UPLOAD_IMAGES);

  saveImage(buffer: Buffer, originalFilename: string): string {
    const timestamp = Date.now();

    // Loại bỏ ký tự đặc biệt khỏi tên file
    const safeName = originalFilename
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    const fileName = `${timestamp}-${safeName}`;
    const fullPath = path.join(this.folder, fileName);

    // Tạo thư mục nếu chưa có
    fs.mkdirSync(this.folder, { recursive: true });

    // Ghi file
    fs.writeFileSync(fullPath, buffer);

    return fileName;
  }

  removeImage(filename: string): boolean {
    const fullPath = path.join(this.folder, filename);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }

    return false; // file không tồn tại
  }

  saveJson(folder: string, filename: string, data: any): void {
    fs.mkdirSync(folder, { recursive: true });

    const fullPath = path.join(folder, filename);

    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
  }

  readJson(folder: string, filename: string): string | null {
    try {
      const fullPath = path.join(folder, filename);

      if (!fs.existsSync(fullPath)) return null;

      return fs.readFileSync(fullPath, 'utf8');
    } catch (error) {
      console.error('Failed to read text file:', error);
      return null;
    }
  }
}
