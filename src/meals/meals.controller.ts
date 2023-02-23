import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { SearchMealQueryDto } from './dto/search-meal-query.dto';
import { MealsService } from './meals.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidation } from './fileValidation';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addMeal(@Body() createMealDto: CreateMealDto) {
    return this.mealsService.insertMeal(createMealDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllMeals(@Query() query: SearchMealQueryDto) {
    return this.mealsService.getMeals(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMeal(@Param('id') id: string) {
    return this.mealsService.getMeal(Number(id));
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile(fileValidation) image: Express.Multer.File,
  ) {
    return this.mealsService.uploadImage(Number(id), image);
  }
}
