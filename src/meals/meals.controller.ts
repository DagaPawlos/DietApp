import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { SearchMealQueryDto } from './dto/search-meal-query.dto';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  addMeal(@Body() createMealDto: CreateMealDto) {
    return this.mealsService.insertMeal(createMealDto);
  }

  @Get()
  getAllMeals(@Query() query: SearchMealQueryDto) {
    return this.mealsService.getMeals(query);
  }

  @Get(':id')
  getMeal(@Param('id') id: string) {
    return this.mealsService.getMeal(Number(id));
  }
}
