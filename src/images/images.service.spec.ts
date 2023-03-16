import { NotFoundException, StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import { PassThrough } from 'stream';

jest.mock('fs/promises');
jest.mock('fs');

describe('ImagesService', () => {
  let imagesService: ImagesService;
  const fsPromisesModule = fsPromises;
  const fsModule = fs;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile();

    imagesService = app.get<ImagesService>(ImagesService);
  });
  describe('getImage', () => {
    it('should throw error when image is not found ', async () => {
      //given
      const path = 'meals-images/123.jpg';
      fsPromisesModule.stat = jest
        .fn()
        .mockRejectedValue(new Error('mock error'));

      //when
      const result = imagesService.getImage(path);
      //then
      expect(result).rejects.toThrowError(NotFoundException);
    });
    it('should return streamable file', async () => {
      //given
      const path = 'meals-images/img-123.jpg';
      fsPromisesModule.stat = jest.fn().mockResolvedValue({});
      fsModule.createReadStream = jest.fn().mockReturnValue(new PassThrough());

      //when
      const result = await imagesService.getImage(path);
      //then
      expect(result).toBeInstanceOf(StreamableFile);
    });
  });
});
