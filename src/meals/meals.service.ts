import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredients } from '../ingredients/ingredients.model';
import { Repository } from 'typeorm';
import { CreateMealDto } from './dto/create-meal.dto';
import { SearchMealQueryDto } from './dto/search-meal-query.dto';
import { Meal, MealType } from './meals.model';
import { MealsImageService } from './meals-image.service';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal) private mealsRepository: Repository<Meal>,
    private mealsImageService: MealsImageService,
  ) {}

  async insertMeal(body: CreateMealDto): Promise<Meal> {
    const newMeal = new Meal();
    newMeal.name = body.name;
    newMeal.calories = body.calories;
    newMeal.proteins = body.proteins;
    newMeal.carbons = body.carbons;
    newMeal.fats = body.fats;
    newMeal.mealOwner = body.mealOwner;
    newMeal.mealType = body.mealType;
    newMeal.fileName = body.fileName;

    const ingredients = body.ingredients.map((ingredient) => {
      const newIngredient = new Ingredients();
      newIngredient.name = ingredient.name;
      newIngredient.quantity = ingredient.quantity;
      newIngredient.unit = ingredient.unit;
      return newIngredient;
    });

    newMeal.ingredients = ingredients;

    const meal = await this.mealsRepository.save(newMeal);
    return meal;
  }

  async getMeals(query: SearchMealQueryDto) {
    const meals = await this.mealsRepository.find({
      where: { mealOwner: query.mealOwner, mealType: query.mealType },
      select: { id: true, name: true, mealType: true, imagePath: true },
    });

    const mealTable = {
      breakfastes: [],
      elevenses: [],
      lunches: [],
      dinners: [],
    };

    for (let i = 0; i < meals.length; i++) {
      const meal = {
        id: meals[i].id,
        name: meals[i].name,
        imagePath: meals[i].imagePath,
      };

      switch (meals[i].mealType) {
        case MealType.BREAKFAST: {
          mealTable.breakfastes.push(meal);
          break;
        }
        case MealType.ELEVENSES: {
          mealTable.elevenses.push(meal);
          break;
        }
        case MealType.LUNCH: {
          mealTable.lunches.push(meal);
          break;
        }
        case MealType.DINNER: {
          mealTable.dinners.push(meal);
          break;
        }
      }
    }

    return mealTable;
  }

  async getMeal(id: number): Promise<Meal> {
    return this.mealsRepository.findOneBy({ id });
  }

  async uploadImage(id: number, image: Express.Multer.File) {
    const meal = await this.mealsRepository.findOneBy({ id });
    if (!meal) throw new NotFoundException();

    const path = await this.mealsImageService.uploadImage(image);

    await this.mealsRepository.update({ id: meal.id }, { imagePath: path });
  }
}
