import { Controller, Post, Body } from '@nestjs/common';
import { CreateDietDto } from './create-diet.dto';
import { DietsService } from './diets.service';
import { PdfService } from './pdf.service';

@Controller('diets')
export class DietsController {
  constructor(
    private readonly dietsService: DietsService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  async createDiet(@Body() createDietDto: CreateDietDto) {
    const diet = await this.dietsService.createDiet(createDietDto);
    this.pdfService.createPdf(diet);
    return diet;
  }
}
