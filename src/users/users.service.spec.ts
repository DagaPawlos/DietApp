import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { CryptoService } from '../crypto/crypto.service';
import { User } from './users.model';
import { UsersService } from './users.service';

describe('UserssService', () => {
  let usersService: UsersService;

  const usersRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const cryptoService = {
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getRepositoryToken(User), useValue: usersRepository },
        UsersService,
        { provide: CryptoService, useValue: cryptoService },
      ],
    }).compile();

    usersService = app.get<UsersService>(UsersService);
  });
  describe('addUser', () => {
    it('should throw error when user with given login already exist ', async () => {
      //given
      const dto: RegisterUserDto = {
        login: 'Popi',
        password: 'haslo123',
      };
      usersRepository.findOne.mockResolvedValue({
        login: 'Popi',
        password: 'haslo123',
      });

      //when
      const result = usersService.addUser(dto);

      //then
      await expect(result).rejects.toThrowError(BadRequestException);
    });

    it('should return new user ', async () => {
      //given
      const dto: RegisterUserDto = {
        login: 'Popi',
        password: 'haslo123',
      };
      cryptoService.hashPassword.mockResolvedValue({
        hash: 'haslo123',
        salt: 'salt',
      });

      usersRepository.findOne.mockResolvedValue(null);
      usersRepository.save.mockResolvedValue({
        id: 1,
        login: 'Popi',
      });

      //when
      const result = await usersService.addUser(dto);

      //then
      expect(result.id).toBe(1);
      expect(result.login).toBe('Popi');
    });
  });

  describe('findUser', () => {
    it('should return user', async () => {
      //given
      const login = 'Popi';
      const user = {
        login,
        id: 1,
      };
      usersRepository.findOne.mockResolvedValue(user);

      //when

      const result = await usersService.findUser(login);
      //then
      expect(result).toStrictEqual(user);
    });
  });
});
