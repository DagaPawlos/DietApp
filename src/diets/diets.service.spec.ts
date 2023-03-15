import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Meal, MealType, Owner } from '../meals/meals.model';
import { DietsService } from './diets.service';
import { CreateDietDto } from './create-diet.dto';
import { Unit } from '../ingredients/ingredients.model';

describe('DietsService', () => {
  let dietsService: DietsService;

  const mealsRepository = {
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(Meal), useValue: mealsRepository },
        DietsService,
      ],
    }).compile();

    dietsService = app.get<DietsService>(DietsService);
  });

  describe('createDiet', () => {
    const createMeal = (override: {
      id: number;
      calories: number;
      mealOwner: Owner;
      mealType: MealType;
      ingredients: { name: string; quantity: number; unit: Unit }[];
    }) => ({
      id: override.id,
      calories: override.calories,
      ingredients: override.ingredients,
      mealOwner: override.mealOwner,
      mealType: override.mealType,
      carbons: 20,
      fats: 30,
      fileName: 'popi.pdf',
      name: 'Szakszuka',
      proteins: 25,
      imagePath: 'image.jpg',
    });

    it('should return diet plan with correct assign of meal type', async () => {
      //given
      const newMeals = [
        createMeal({
          id: 1,
          calories: 385,
          mealOwner: Owner.DAGA,
          mealType: MealType.BREAKFAST,
          ingredients: [
            {
              name: 'Truskawka',
              quantity: 12,
              unit: Unit.GRAM,
            },
            {
              name: 'PanŻelka',
              quantity: 5,
              unit: Unit.PIECE,
            },
          ],
        }),
        createMeal({
          id: 2,
          calories: 270,
          mealOwner: Owner.PATRYK,
          mealType: MealType.DINNER,
          ingredients: [
            {
              name: 'PanŻelka',
              quantity: 13,
              unit: Unit.PIECE,
            },
          ],
        }),
      ];

      const dto: CreateDietDto = {
        dietMeal: [
          { id: 1, qty: 1 },
          { id: 2, qty: 2 },
        ],
      };

      mealsRepository.find.mockResolvedValue(newMeals);

      //when
      const result = await dietsService.createDiet(dto);

      //then
      expect(result.meals.breakfastes).toHaveLength(1);
      expect(result.meals.elevenses).toHaveLength(0);
      expect(result.meals.dinners).toHaveLength(1);
      expect(result.meals.lunches).toHaveLength(0);
    });

    it('should return diet plan with correct amount of ingredients for given meal quantity', async () => {
      //given
      const newMeals = [
        createMeal({
          id: 1,
          calories: 385,
          mealOwner: Owner.DAGA,
          mealType: MealType.BREAKFAST,
          ingredients: [
            {
              name: 'Truskawka',
              quantity: 12,
              unit: Unit.GRAM,
            },
            {
              name: 'PanŻelka',
              quantity: 5,
              unit: Unit.PIECE,
            },
          ],
        }),
        createMeal({
          id: 2,
          calories: 270,
          mealOwner: Owner.PATRYK,
          mealType: MealType.DINNER,
          ingredients: [
            {
              name: 'PanŻelka',
              quantity: 13,
              unit: Unit.PIECE,
            },
          ],
        }),
      ];

      const dto: CreateDietDto = {
        dietMeal: [
          { id: 1, qty: 1 },
          { id: 2, qty: 2 },
        ],
      };

      mealsRepository.find.mockResolvedValue(newMeals);

      //when
      const result = await dietsService.createDiet(dto);

      //then
      expect(result.meals.dinners[0].times).toBe(2);

      expect(result.meals.dinners[0].ingredients[0]).toBe('PanŻelka: 52pc');
    });

    it('should return shopping list with correct amount of ingredients', async () => {
      //given
      const newMeals = [
        createMeal({
          id: 1,
          calories: 385,
          mealOwner: Owner.DAGA,
          mealType: MealType.BREAKFAST,
          ingredients: [
            {
              name: 'PanŻelka',
              quantity: 5,
              unit: Unit.PIECE,
            },
          ],
        }),
        createMeal({
          id: 2,
          calories: 270,
          mealOwner: Owner.PATRYK,
          mealType: MealType.DINNER,
          ingredients: [
            {
              name: 'PanŻelka',
              quantity: 13,
              unit: Unit.PIECE,
            },
          ],
        }),
      ];
      const dto: CreateDietDto = {
        dietMeal: [
          { id: 1, qty: 1 },
          { id: 2, qty: 2 },
        ],
      };

      mealsRepository.find.mockResolvedValue(newMeals);

      //when
      const result = await dietsService.createDiet(dto);

      //then
      expect(result.shoppingList[0]).toBe('PanŻelka: 57pc');
    });
  });
});
