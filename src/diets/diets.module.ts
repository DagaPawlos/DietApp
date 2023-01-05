import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DietsController } from './diets.controller';
import { DietsService } from './diets.service';
import { Meal } from 'src/meals/meals.model';

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  controllers: [DietsController],
  providers: [DietsService],
})
export class DietsModule {}
