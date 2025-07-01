// src/common/interceptors/image-upload.interceptor.ts

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export function FileUploadInterceptor(key: string) {
  return FileInterceptor(key, {
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // giới hạn 5MB
    },
  });
}
