import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

@Injectable()
export class ImagesService {
  async getImage(path: string): Promise<StreamableFile> {
    const relativePath = `meals-images/${path}`;
    try {
      await stat(relativePath);
    } catch {
      throw new NotFoundException('Image not found');
    }

    const file = createReadStream(relativePath);

    return new StreamableFile(file);
  }
}
