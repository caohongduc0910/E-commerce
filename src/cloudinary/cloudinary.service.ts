import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    options?: { folder?: string; public_id?: string },
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!file || !file.buffer) {
        reject('File or file buffer is undefined');
      }

      cloudinary.uploader
        .upload_stream(
          {
            folder: options?.folder || 'products',
            public_id: options?.public_id,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
