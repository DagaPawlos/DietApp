import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  login: string;

  @IsString()
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
