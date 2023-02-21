import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateDietDto } from './create-diet.dto';
import { DietsService } from './diets.service';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { StreamableFile } from '@nestjs/common/file-stream';
import { createReadStream } from 'fs';

@Controller('diets')
export class DietsController {
  constructor(
    private readonly dietsService: DietsService,
    private readonly pdfService: PdfService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createDiet(
    @Body() createDietDto: CreateDietDto,
  ): Promise<StreamableFile> {
    const diet = await this.dietsService.createDiet(createDietDto);
    const pdfPath = await this.pdfService.createPdf(diet);

    const file = createReadStream(pdfPath);
    return new StreamableFile(file);
  }
}
