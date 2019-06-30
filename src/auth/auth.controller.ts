import { AuthGuardWithBlackisting } from './../common/guards/custom-auth.guard';
import { LoginUserDto } from '../models/users/login-user.dto';
import { UserDto } from '../models/users/user.dto';
import {
  Controller,
  ValidationPipe,
  Body,
  Post,
  BadRequestException,
  Get,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../core/services/users.service';
import { RegisterUserDTO } from '../models/users/register-user.dto';
import { BadRequestFilter } from '../common/filters/bad-request.filter';
import { NotFoundFilter } from '../common/filters/not-found.filter';
import { Token } from '../decorators/token.decorator';

@UseFilters(BadRequestFilter, NotFoundFilter)
@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body(new ValidationPipe({ transform: true, whitelist: true })) userData: RegisterUserDTO): Promise<UserDto> {
      return await this.usersService.register(userData);
  }

  @Post('login')
  async login(@Body(new ValidationPipe({ transform: true, whitelist: true })) userData: LoginUserDto): Promise<{ token: string }> {
    const token = await this.authService.signIn(userData);
    if (!token) {
      throw new BadRequestException(`Wrong credentials!`);
    }

    return { token };
  }

  @UseGuards(AuthGuardWithBlackisting)
  @Get('logout')
  logout(@Token() token: string): Promise<{ message: string }> {
      return this.authService.logout(token);
  }
}
