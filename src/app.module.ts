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
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Meal, Ingredients, User],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    MealsModule,
    DietsModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
