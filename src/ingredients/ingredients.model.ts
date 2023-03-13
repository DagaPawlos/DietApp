import { Meal } from '../meals/meals.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Unit {
  MILILITR = 'ml',
  GRAM = 'g',
  PIECE = 'pc',
}

@Entity()
export class Ingredients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: Unit,
  })
  unit: Unit;

  @ManyToOne(() => Meal, (meal) => meal.ingredients)
  meal: Meal;
}
