import { Controller, Post, Body } from '@nestjs/common';
import { CreateDietDto } from './create-diet.dto';
import { DietsService } from './diets.service';

@Controller('diets')
export class DietsController {
  constructor(private readonly dietsService: DietsService) {}

  @Post()
  createDiet(@Body() createDietDto: CreateDietDto) {
    return this.dietsService.createDiet(createDietDto);
  }
}
