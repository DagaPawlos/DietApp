import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredients } from 'src/ingredients/ingredients.model';
import { Repository } from 'typeorm';
import { CreateMealDto } from './meals.dto';
import { Meal, MealType } from './meals.model';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal) private mealsRepository: Repository<Meal>,
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

    const ingredients = [];

    for (let i = 0; i < body.ingredients.length; i++) {
      const newIngredient = new Ingredients();
      newIngredient.name = body.ingredients[i].name;
      newIngredient.quantity = body.ingredients[i].quantity;
      newIngredient.unit = body.ingredients[i].unit;

      ingredients.push(newIngredient);
    }

    newMeal.ingredients = ingredients;

    const meal = await this.mealsRepository.save(newMeal);
    return meal;
  }

  async getMeals() {
    const meals = await this.mealsRepository.find({
      select: { id: true, name: true, mealType: true },
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
}
