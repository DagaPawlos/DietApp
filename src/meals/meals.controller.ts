import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMealDto } from './meals.dto';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  addMeal(@Body() createMealDto: CreateMealDto) {
    return this.mealsService.insertMeal(createMealDto);
  }

  @Get()
  getAllMeals() {
    return this.mealsService.getMeals();
  }

  @Get(':id')
  getMeal(@Param('id') id: string) {
    return this.mealsService.getMeal(Number(id));
  }
}
