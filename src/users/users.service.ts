import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { Repository } from 'typeorm';
import { User } from './users.model';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  async addUser(
    body: RegisterUserDto,
  ): Promise<Omit<User, 'password' | 'salt'>> {
    const userExist = await this.usersRepository.findOne({
      where: { login: body.login },
    });
    if (userExist) {
      throw new BadRequestException('User with given login already exists');
    }

    const newUser = new User();
    newUser.login = body.login;

    const { hash, salt } = await this.cryptoService.hashPassword(body.password);

    newUser.password = hash;
    newUser.salt = salt;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      salt: userSalt,
      ...rest
    } = await this.usersRepository.save(newUser);
    return rest;
  }

  async findUser(login: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { login },
    });
  }
}
