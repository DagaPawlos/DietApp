import { IsString, IsNumber, IsEnum } from 'class-validator';
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

  @IsEnum(Owner)
  mealOwner: Owner;

  @IsEnum(MealType)
  mealType: MealType;
}
