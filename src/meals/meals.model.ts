import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
