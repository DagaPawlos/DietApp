import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
})
export class AuthModule {}
