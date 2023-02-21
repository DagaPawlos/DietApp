import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateDietDto } from './create-diet.dto';
import { DietsService } from './diets.service';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('diets')
export class DietsController {
  constructor(
    private readonly dietsService: DietsService,
    private readonly pdfService: PdfService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createDiet(@Body() createDietDto: CreateDietDto) {
    const diet = await this.dietsService.createDiet(createDietDto);
    this.pdfService.createPdf(diet);
    return diet;
  }
}
