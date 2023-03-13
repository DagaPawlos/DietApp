import { Test, TestingModule } from '@nestjs/testing';
import { MealsImageService } from './meals-image.service';
import * as fs from 'fs/promises';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('fs/promises');

describe('MealsImageService', () => {
  let mealsImageService: MealsImageService;
  const fsModule = fs;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [MealsImageService],
    }).compile();

    mealsImageService = app.get<MealsImageService>(MealsImageService);
  });

  describe('uploadImage', () => {
    it('should throw error when cannot write file ', async () => {
      //given
      fsModule.writeFile = jest
        .fn()
        .mockRejectedValueOnce(new Error('mock error'));
      const image = {
        originalname: 'popi.jpg',
        buffer: Buffer.from('data'),
      };

      //when
      const result = mealsImageService.uploadImage(image as any);

      //then
      await expect(result).rejects.toThrowError(InternalServerErrorException);
    });
    it('Should return path', async () => {
      //given
      fsModule.writeFile = jest.fn().mockResolvedValue(null);
      const image = {
        originalname: 'popi.jpg',
        buffer: Buffer.from('data'),
      };
      const now = new Date(2023, 2, 13);
      jest.useFakeTimers().setSystemTime(now);
      //when
      const result = await mealsImageService.uploadImage(image as any);
      //then
      expect(result).toBe(`meals-images/img-${now.getTime()}.jpg`);
    });
  });
});
