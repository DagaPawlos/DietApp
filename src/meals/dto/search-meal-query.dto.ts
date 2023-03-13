import { MealType, Owner } from '../meals.model';
import { IsEnum, IsOptional } from 'class-validator';

export class SearchMealQueryDto {
  @IsOptional()
  @IsEnum(Owner)
  mealOwner?: Owner;

  @IsOptional()
  @IsEnum(MealType)
  mealType?: MealType;
}
