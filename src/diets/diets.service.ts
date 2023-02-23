import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from 'src/ingredients/ingredients.model';
import { Meal, MealType, Owner } from 'src/meals/meals.model';
import { In, Repository } from 'typeorm';
import { DagaTargetCalories, PatrykTargetCalories } from './calories-config';
import { CreateDietDto, DietMeal } from './create-diet.dto';

export interface MealChoice {
  name: string;
  owner: Owner;
  file: string;
  times: number;
  ingredients: string[];
  imagePath: string;
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

    const ingredients: { [x: string]: { qty: number; unit: Unit } } = {};
    const dietForWeek = {
      breakfastes: [],
      elevenses: [],
      lunches: [],
      dinners: [],
    };
    for (let i = 0; i < meals.length; i++) {
      const caloriesFactor = this.countCaloriesFactor(meals[i]);

      const mealData = this.prepareMealData(meals[i], body.dietMeal);

      for (let j = 0; j < meals[i].ingredients.length; j++) {
        const ingredientUnit = meals[i].ingredients[j].unit;
        const ingredientQuantity = this.countIngredientQuantity(
          meals[i].ingredients[j].quantity,
          body.dietMeal[i].qty,
          caloriesFactor,
        );
        const ingredient = `${meals[i].ingredients[j].name}: ${ingredientQuantity}${ingredientUnit}`;
        mealData.ingredients.push(ingredient);

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
    }

    const shoppingList = Object.entries(ingredients).map(
      ([ingredientName, ingredient]) =>
        `${ingredientName}: ${ingredient.qty}${ingredient.unit}`,
    );

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
      times: dietMeals.find((dietMeal) => dietMeal.id == meal.id).qty,
      ingredients: [],
      imagePath: meal.imagePath,
    };
  }

  private countCaloriesFactor(meal: Meal): number {
    switch (meal.mealType) {
      case MealType.BREAKFAST: {
        return (
          (meal.mealOwner == Owner.PATRYK
            ? PatrykTargetCalories.BREAKFAST
            : DagaTargetCalories.BREAKFAST) / meal.calories
        );
      }
      case MealType.ELEVENSES: {
        return (
          (meal.mealOwner == Owner.PATRYK
            ? PatrykTargetCalories.ELEVENSES
            : DagaTargetCalories.ELEVENSES) / meal.calories
        );
      }
      case MealType.LUNCH: {
        return (
          (meal.mealOwner == Owner.PATRYK
            ? PatrykTargetCalories.LUNCH
            : DagaTargetCalories.LUNCH) / meal.calories
        );
      }
      case MealType.DINNER: {
        return (
          (meal.mealOwner == Owner.PATRYK
            ? PatrykTargetCalories.DINNER
            : DagaTargetCalories.DINNER) / meal.calories
        );
      }
    }
  }
}
