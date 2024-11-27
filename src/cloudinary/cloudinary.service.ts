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

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!file || !file.buffer) {
        reject('File or file buffer is undefined');
      }

      cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });
  }
}
