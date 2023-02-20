import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { CryptoModule } from 'src/crypto/crypto.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UsersModule, CryptoModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
