import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './meals/meals.model';
import { MealsModule } from './meals/meals.module';
import { Ingredients } from './ingredients/ingredients.model';
import { DietsModule } from './diets/diets.module';
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'haslo',
      database: 'diet-app',
      entities: [Meal, Ingredients, User],
      synchronize: true,
      logging: true,
    }),
    MealsModule,
    DietsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
