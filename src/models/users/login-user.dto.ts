import { IsString, MinLength, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/)
  password: string;
}
