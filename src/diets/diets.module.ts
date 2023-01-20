import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DietsController } from './diets.controller';
import { DietsService } from './diets.service';
import { Meal } from 'src/meals/meals.model';
import { PdfService } from './pdf.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  controllers: [DietsController],
  providers: [DietsService, PdfService],
})
export class DietsModule {}
