import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Unit } from '../ingredients/ingredients.model';
import { CreateMealDto } from './dto/create-meal.dto';
import { MealsImageService } from './meals-image.service';
import { Meal, MealType, Owner } from './meals.model';
import { MealsService } from './meals.service';

describe('MealsService', () => {
  let mealsService: MealsService;

  const mealsRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  const mealsImageService = {
    uploadImage: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(Meal), useValue: mealsRepository },
        { provide: MealsImageService, useValue: mealsImageService },
        MealsService,
      ],
    }).compile();

    mealsService = app.get<MealsService>(MealsService);
  });

  describe('insertMeal', () => {
    it('should save meal in database', async () => {
      // given
      const dto: CreateMealDto = {
        name: 'Meal',
        calories: 123,
        carbons: 345,
        fats: 872,
        proteins: 123,
        fileName: 'klops.pdf',
        mealOwner: Owner.PATRYK,
        mealType: MealType.DINNER,
        ingredients: [{ name: 'Cebula', quantity: 1, unit: Unit.GRAM }],
      };

      // when
      await mealsService.insertMeal(dto);

      // then
      expect(mealsRepository.save).toBeCalledTimes(1);
    });

    it('should return meal with ingredients', async () => {
      // given
      const dto: CreateMealDto = {
        name: 'Meal',
        calories: 123,
        carbons: 345,
        fats: 872,
        proteins: 123,
        fileName: 'klops.pdf',
        mealOwner: Owner.PATRYK,
        mealType: MealType.DINNER,
        ingredients: [{ name: 'Cebula', quantity: 1, unit: Unit.GRAM }],
      };
      mealsRepository.save.mockResolvedValue(dto);

      // when
      const result = await mealsService.insertMeal(dto);

      // then
      expect(result.ingredients).toHaveLength(1);
      expect(result.name).toBe(dto.name);
    });
  });

  describe('getMeal', () => {
    it('should return one meal by given id', async () => {
      //given
      const id = 1;
      mealsRepository.findOneBy.mockResolvedValue({
        id: 1,
      });

      //when
      const result = await mealsService.getMeal(id);

      //then
      expect(result.id).toBe(id);
    });

    it('should return all meals with correct assign to mealType', async () => {
      //given
      const searchDto = {};
      mealsRepository.find.mockResolvedValue([
        {
          id: 1,
          name: 'Szakszuka',
          imagePath: 'PanŚcieżka',
          mealType: MealType.BREAKFAST,
        },
        {
          id: 2,
          name: 'Szakszuk',
          imagePath: 'PanŚcieżka2',
          mealType: MealType.DINNER,
        },
      ]);

      //when
      const result = await mealsService.getMeals(searchDto);

      //then
      expect(result.breakfastes).toHaveLength(1);
      expect(result.dinners).toHaveLength(1);
      expect(result.elevenses).toHaveLength(0);
      expect(result.lunches).toHaveLength(0);
    });
  });

  it('should return meals with correct data', async () => {
    //given
    const searchDto = {};
    mealsRepository.find.mockResolvedValue([
      {
        id: 3,
        name: 'Kartofelek',
        imagePath: 'PanŚcieżka3',
        mealType: MealType.BREAKFAST,
      },
      {
        id: 2,
        name: 'Szakszuk',
        imagePath: 'PanŚcieżka2',
        mealType: MealType.DINNER,
      },
    ]);

    //when
    const result = await mealsService.getMeals(searchDto);

    //then
    expect(result.breakfastes[0]).toStrictEqual({
      id: 3,
      name: 'Kartofelek',
      imagePath: 'PanŚcieżka3',
    });
    expect(result.dinners[0]).toStrictEqual({
      id: 2,
      name: 'Szakszuk',
      imagePath: 'PanŚcieżka2',
    });
  });

  describe('uploadImage', () => {
    it('should return updated meal', async () => {
      //given
      const id = 1;
      const image = {
        imagePath: 'PanŚcieżka',
        originalname: 'plik.jpg',
        buffer: new Buffer('jpg'),
      };
      mealsRepository.findOneBy.mockResolvedValue({
        id: 1,
        imagePath: 'Ścieżka',
      });
      mealsImageService.uploadImage.mockResolvedValue('path.jpg');

      //when
      await mealsService.uploadImage(id, image as any);
      // then
      expect(mealsRepository.update).toBeCalledTimes(1);
      expect(mealsRepository.update).toHaveBeenCalledWith(
        { id },
        { imagePath: 'path.jpg' },
      );
    });

    it('should return error when updated meal doesnt exist', async () => {
      //given
      const id = 1;
      const image = {
        imagePath: 'PanŚcieżka1',
      };

      mealsRepository.findOneBy.mockResolvedValue(null);

      //when
      const result = mealsService.uploadImage(id, image as any);

      //then
      await expect(result).rejects.toThrowError(NotFoundException);
    });
  });
});
