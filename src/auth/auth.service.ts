import { Injectable } from '@nestjs/common';
import { CryptoService } from 'src/crypto/crypto.service';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly cryptoService: CryptoService,
  ) {}

  async validateUser(
    login: string,
    pass: string,
  ): Promise<Omit<User, 'password' | 'salt'>> {
    const user = await this.usersService.findUser(login);
    const passwordHash = await this.cryptoService.hashLoginPassword(
      pass,
      user.salt,
    );
    if (user && user.password === passwordHash) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, salt, ...result } = user;
      return result;
    }
    return null;
  }
}
