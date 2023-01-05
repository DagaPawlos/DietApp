import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { IngredientDto } from 'src/ingredients/ingredients.dto';
import { MealType, Owner } from './meals.model';

export class CreateMealDto {
  @IsString()
  name: string;

  @IsNumber()
  calories: number;

  @IsNumber()
  proteins: number;

  @IsNumber()
  carbons: number;

  @IsNumber()
  fats: number;

  @IsString()
  fileName: string;

  @IsEnum(Owner)
  mealOwner: Owner;

  @IsEnum(MealType)
  mealType: MealType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];
}
