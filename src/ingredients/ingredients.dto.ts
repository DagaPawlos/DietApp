import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Unit } from './ingredients.model';

export class IngredientDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsEnum(Unit)
  unit: Unit;
}
