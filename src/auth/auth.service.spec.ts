import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const usersService = {
    findUser: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UsersService, useValue: usersService },
        CryptoService,
        { provide: JwtService, useValue: jwtService },
        AuthService,
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return login and id when user exist and password is correct ', async () => {
      //given
      const login = 'Popi';
      const password = 'haslo123';
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      usersService.findUser.mockResolvedValue({
        id: 1,
        login: 'Popi',
        password: hashPassword,
        salt,
      });

      //when
      const result = await authService.validateUser(login, password);

      //then
      expect(result.login).toBe('Popi');
      expect(result.id).toBe(1);
      expect(result['password']).toBeUndefined();
    });

    it('should return null when user doesnt exist or password is incorrect ', async () => {
      //given
      const login = 'Popi';
      const password = 'haslo123';
      const passwordToValidate = 'haslo1234';
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      usersService.findUser.mockResolvedValue({
        id: 1,
        login: 'Popi',
        password: hashPassword,
        salt,
      });

      //when
      const result = await authService.validateUser(login, passwordToValidate);

      //then
      expect(result).toBe(null);
    });
  });
  describe('login', () => {
    it('should return access token', async () => {
      //given
      const password = 'haslo123';
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const user = {
        id: 1,
        login: 'Popi',
        password: hashPassword,
        salt,
      };

      jwtService.sign.mockReturnValue('1234');

      //when
      const result = await authService.login(user);
      //then
      expect(result.access_token).toBe('1234');
    });
  });
});
