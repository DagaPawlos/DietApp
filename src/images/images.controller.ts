import { Controller, Get, Header, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':path')
  @Header('content-type', 'image/jpeg')
  getImage(@Param('path') path: string) {
    return this.imagesService.getImage(path);
  }
}
