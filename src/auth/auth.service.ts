import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../crypto/crypto.service';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private jwtService: JwtService,
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

  async login(user: User) {
    const payload = { username: user.login, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
