import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class MealsImageService {
  async uploadImage(image: Express.Multer.File) {
    const path = this.createPath(image.originalname);

    try {
      await writeFile(path, image.buffer);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return path;
  }

  private createPath(originalname: string) {
    return `meals-images/img-${Date.now()}.${originalname.split('.').pop()}`;
  }
}
