import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal, MealType, Owner } from 'src/meals/meals.model';
import { In, Repository } from 'typeorm';
import { DagaTargetCalories, PatrykTargetCalories } from './calories-config';
import { CreateDietDto } from './create-diet.dto';

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
    const mealIdTable: number[] = [];

    for (let i = 0; i < body.dietMeal.length; i++) {
      mealIdTable.push(body.dietMeal[i].id);
    }

    const meals = await this.mealsRepository.find({
      where: { id: In(mealIdTable) },
      relations: { ingredients: true },
    });

    const qtyMeal = {};
    for (let i = 0; i < meals.length; i++) {
      let caloriesFactor;
      if (meals[i].mealOwner == Owner.PATRYK) {
        switch (meals[i].mealType) {
          case MealType.BREAKFAST: {
            caloriesFactor = PatrykTargetCalories.BREAKFAST / meals[i].calories;
            break;
          }
          case MealType.ELEVENSES: {
            caloriesFactor = PatrykTargetCalories.ELEVENSES / meals[i].calories;
            break;
          }
          case MealType.LUNCH: {
            caloriesFactor = PatrykTargetCalories.LUNCH / meals[i].calories;
            break;
          }
          case MealType.DINNER: {
            caloriesFactor = PatrykTargetCalories.DINNER / meals[i].calories;
            break;
          }
        }
      } else {
        switch (meals[i].mealType) {
          case MealType.BREAKFAST: {
            caloriesFactor = DagaTargetCalories.BREAKFAST / meals[i].calories;
            break;
          }
          case MealType.ELEVENSES: {
            caloriesFactor = DagaTargetCalories.ELEVENSES / meals[i].calories;
            break;
          }
          case MealType.LUNCH: {
            caloriesFactor = DagaTargetCalories.LUNCH / meals[i].calories;
            break;
          }
          case MealType.DINNER: {
            caloriesFactor = DagaTargetCalories.DINNER / meals[i].calories;
            break;
          }
        }
      }

      for (let j = 0; j < meals[i].ingredients.length; j++) {
        const ingQ = meals[i].ingredients[j].quantity;
        const ingU = meals[i].ingredients[j].unit;
        const ingQty = Math.round(ingQ * body.dietMeal[i].qty * caloriesFactor);

        if (qtyMeal[meals[i].ingredients[j].name]) {
          qtyMeal[meals[i].ingredients[j].name] = {
            qty: qtyMeal[meals[i].ingredients[j].name].qty + ingQty,
            unit: ingU,
          };
        } else {
          qtyMeal[meals[i].ingredients[j].name] = { qty: ingQty, unit: ingU };
        }
      }
    }
    const shoppingList = [];

    for (const [key, value] of Object.entries(qtyMeal)) {
      const ing = `${key}: ${(<any>value).qty}${(<any>value).unit}`;
      shoppingList.push(ing);
    }

    const dietForWeek = {
      breakfastes: [],
      elevenses: [],
      lunches: [],
      dinners: [],
    };

    for (let i = 0; i < meals.length; i++) {
      const mealsData = {
        name: meals[i].name,
        owner: meals[i].mealOwner,
        file: meals[i].fileName,
        times: body.dietMeal.find((arg) => arg.id == meals[i].id).qty,
      };
      switch (meals[i].mealType) {
        case MealType.BREAKFAST: {
          dietForWeek.breakfastes.push(mealsData);
          break;
        }
        case MealType.ELEVENSES: {
          dietForWeek.elevenses.push(mealsData);
          break;
        }
        case MealType.LUNCH: {
          dietForWeek.lunches.push(mealsData);
          break;
        }
        case MealType.DINNER: {
          dietForWeek.dinners.push(mealsData);
          break;
        }
      }
    }

    return {
      meals: dietForWeek,
      shoppingList,
    };
  }
}
