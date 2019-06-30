import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseFilters,
} from '@nestjs/common';

import { HttpExceptionFilter } from './../common/filters/http-exception.filter';
import { NotFoundFilter } from '../common/filters/not-found.filter';
import { BadRequestFilter } from './../common/filters/bad-request.filter';
import { AuthGuardWithBlackisting } from './../common/guards/custom-auth.guard';
import { UserDto } from '../models/users/user.dto';
import { UsersService } from '../core/services/users.service';

@UseGuards(AuthGuardWithBlackisting)
@UseFilters(BadRequestFilter, NotFoundFilter, HttpExceptionFilter)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async findUser(@Param('username') username: string): Promise<UserDto> {
    return await this.usersService.findByUsername(username);
  }

}
