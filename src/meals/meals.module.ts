import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealsImageService } from './meals-image.service';
import { MealsController } from './meals.controller';
import { Meal } from './meals.model';
import { MealsService } from './meals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  controllers: [MealsController],
  providers: [MealsService, MealsImageService],
})
export class MealsModule {}
