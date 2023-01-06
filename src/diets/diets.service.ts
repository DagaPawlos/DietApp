import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal, Owner } from 'src/meals/meals.model';
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
        const ing = meals[i].ingredients[j].quantity;
        const ingQty = ing * body.dietMeal[i].qty;

        if (qtyMeal[meals[i].ingredients[j].name]) {
          qtyMeal[meals[i].ingredients[j].name] =
            qtyMeal[meals[i].ingredients[j].name] + ingQty;
        } else {
          qtyMeal[meals[i].ingredients[j].name] = ingQty;
        }
      }
    }

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
