import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal, MealType, Owner } from 'src/meals/meals.model';
import { In, Repository } from 'typeorm';
import { DagaTargetCalories, PatrykTargetCalories } from './calories-config';
import { CreateDietDto, DietMeal } from './create-diet.dto';

interface MealChoice {
  name: string;
  owner: Owner;
  plik: string;
  qty: number;
}

export interface DietPlan {
  meals: {
    breakfastes: MealChoice[];
    elevenses: MealChoice[];
    lunches: MealChoice[];
    dinners: MealChoice[];
  };
  shoppingList: string[];
}

@Injectable()
export class DietsService {
  constructor(
    @InjectRepository(Meal) private mealsRepository: Repository<Meal>,
  ) {}

  async createDiet(body: CreateDietDto): Promise<DietPlan> {
    const mealIds = body.dietMeal.map((meal) => meal.id);

    const meals = await this.mealsRepository.find({
      where: { id: In(mealIds) },
      relations: { ingredients: true },
    });

    const ingredients = {};
    const dietForWeek = {
      breakfastes: [],
      elevenses: [],
      lunches: [],
      dinners: [],
    };
    for (let i = 0; i < meals.length; i++) {
      const caloriesFactor = this.countCaloriesFactor(meals[i]);

      const mealData = this.prepareMealData(meals[i], body.dietMeal);
      switch (meals[i].mealType) {
        case MealType.BREAKFAST: {
          dietForWeek.breakfastes.push(mealData);
          break;
        }
        case MealType.ELEVENSES: {
          dietForWeek.elevenses.push(mealData);
          break;
        }
        case MealType.LUNCH: {
          dietForWeek.lunches.push(mealData);
          break;
        }
        case MealType.DINNER: {
          dietForWeek.dinners.push(mealData);
          break;
        }
      }

      for (let j = 0; j < meals[i].ingredients.length; j++) {
        const ingredientUnit = meals[i].ingredients[j].unit;
        const ingredientQuantity = this.countIngredientQuantity(
          meals[i].ingredients[j].quantity,
          body.dietMeal[i].qty,
          caloriesFactor,
        );

        if (ingredients[meals[i].ingredients[j].name]) {
          ingredients[meals[i].ingredients[j].name] = {
            qty:
              ingredients[meals[i].ingredients[j].name].qty +
              ingredientQuantity,
            unit: ingredientUnit,
          };
        } else {
          ingredients[meals[i].ingredients[j].name] = {
            qty: ingredientQuantity,
            unit: ingredientUnit,
          };
        }
      }
    }

    const shoppingList = [];
    for (const [key, value] of Object.entries(ingredients)) {
      const ingredient = `${key}: ${(<any>value).qty}${(<any>value).unit}`;
      shoppingList.push(ingredient);
    }

    return {
      meals: dietForWeek,
      shoppingList,
    };
  }

  private countIngredientQuantity(
    ingredientQuantity: number,
    dietMealQuantity: number,
    caloriesFactor: number,
  ) {
    return Math.round(ingredientQuantity * dietMealQuantity * caloriesFactor);
  }

  private prepareMealData(meal: Meal, dietMeals: DietMeal[]) {
    return {
      name: meal.name,
      owner: meal.mealOwner,
      file: meal.fileName,
      times: dietMeals.find((arg) => arg.id == meal.id).qty,
    };
  }

  private countCaloriesFactor(meal: Meal): number {
    let caloriesFactor;
    if (meal.mealOwner == Owner.PATRYK) {
      switch (meal.mealType) {
        case MealType.BREAKFAST: {
          caloriesFactor = PatrykTargetCalories.BREAKFAST / meal.calories;
          break;
        }
        case MealType.ELEVENSES: {
          caloriesFactor = PatrykTargetCalories.ELEVENSES / meal.calories;
          break;
        }
        case MealType.LUNCH: {
          caloriesFactor = PatrykTargetCalories.LUNCH / meal.calories;
          break;
        }
        case MealType.DINNER: {
          caloriesFactor = PatrykTargetCalories.DINNER / meal.calories;
          break;
        }
      }
    } else {
      switch (meal.mealType) {
        case MealType.BREAKFAST: {
          caloriesFactor = DagaTargetCalories.BREAKFAST / meal.calories;
          break;
        }
        case MealType.ELEVENSES: {
          caloriesFactor = DagaTargetCalories.ELEVENSES / meal.calories;
          break;
        }
        case MealType.LUNCH: {
          caloriesFactor = DagaTargetCalories.LUNCH / meal.calories;
          break;
        }
        case MealType.DINNER: {
          caloriesFactor = DagaTargetCalories.DINNER / meal.calories;
          break;
        }
      }
    }
    return caloriesFactor;
  }
}
