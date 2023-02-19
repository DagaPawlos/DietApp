import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { CryptoService } from '../crypto/crypto.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class AuthModule {}
