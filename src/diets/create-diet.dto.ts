import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDietDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DietMeal)
  dietMeal: DietMeal[];
}

export class DietMeal {
  @IsNumber()
  id: number;

  @IsNumber()
  qty: number;
}
