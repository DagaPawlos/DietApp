import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal, MealType, Owner } from 'src/meals/meals.model';
import { In, Repository } from 'typeorm';
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
      for (let j = 0; j < meals[i].ingredients.length; j++) {
        const ingQ = meals[i].ingredients[j].quantity;
        const ingU = meals[i].ingredients[j].unit;
        const ingQty = ingQ * body.dietMeal[i].qty;

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
    const dietForWeek = {
      meals: {
        breakfastes: [],
        elevenses: [],
        lunches: [],
        dinners: [],
      },
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
          dietForWeek.meals.breakfastes.push(mealsData);
          break;
        }
        case MealType.ELEVENSES: {
          dietForWeek.meals.elevenses.push(mealsData);
          break;
        }
        case MealType.LUNCH: {
          dietForWeek.meals.lunches.push(mealsData);
          break;
        }
        case MealType.DINNER: {
          dietForWeek.meals.dinners.push(mealsData);
          break;
        }
      }
    }

    console.log(dietForWeek);

    return {
      meals: {
        breakfastes: [],
        elevenses: [],
        lunches: [],
        dinners: [],
      },
      shoppingList: [],
    };
  }
}
