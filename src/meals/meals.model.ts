import { Ingredients } from 'src/ingredients/ingredients.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum Owner {
  DAGA = 'daga',
  PATRYK = 'patryk',
}

export enum MealType {
  BREAKFAST = 'breakfast',
  ELEVENSES = 'elevenses',
  LUNCH = 'lunch',
  DINNER = 'dinner',
}

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  calories: number;

  @Column()
  proteins: number;

  @Column()
  carbons: number;

  @Column()
  fats: number;

  @Column()
  fileName: string;

  @Column({
    type: 'enum',
    enum: Owner,
  })
  mealOwner: Owner;

  @Column({
    type: 'enum',
    enum: MealType,
  })
  mealType: MealType;

  @OneToMany(() => Ingredients, (ingredients) => ingredients.meal, {
    cascade: true,
  })
  ingredients: Ingredients[];
}
