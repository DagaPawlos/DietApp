import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMealDto } from './meals.dto';
import { Meal } from './meals.model';

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

    const meal = await this.mealsRepository.save(newMeal);
    return meal;
  }

  async getMeals(): Promise<Meal[]> {
    return this.mealsRepository.find();
  }

  async getMeal(id: number): Promise<Meal> {
    return this.mealsRepository.findOneBy({ id });
  }
}
