import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { Repository } from 'typeorm';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async addUser(body: RegisterUserDto): Promise<User> {
    const userExist = await this.usersRepository.findOne({
      where: { login: body.login },
    });
    if (userExist) {
      throw new UnauthorizedException();
    }

    const newUser = new User();
    newUser.login = body.login;
    newUser.password = body.password;

    const user = await this.usersRepository.save(newUser);
    return user;
  }
}
