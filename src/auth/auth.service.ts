import { RedisService } from 'nestjs-redis';
import { UserBadRequest } from './../common/exeptions/user-bad-request';
import { JwtPayload } from '../common/interfaces/jwt-payload';
import { LoginUserDto } from '../models/users/login-user.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../core/services/users.service';
import { User } from '../data/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    // private readonly redisService: RedisService,
  ) {}

  async signIn(userData: LoginUserDto): Promise<string> {
    const { username } = userData;
    const user = await this.usersService.signIn(username);
    if (!user) {
      throw new UserBadRequest(`No such user`);
    }
    const isPasswordValid = await this.usersService.validatePassword(userData);
    if (!isPasswordValid) {
      throw new UserBadRequest(`Password doesn't match`);
    }
    const userPayload: JwtPayload = { username: user.username, lastName: user.lastName };

    return await this.jwtService.sign(userPayload);
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.usersService.validate(payload);
  }

  async logout(token: string): Promise<{ message: string }> {
    // const client = await this.redisService.getClient();
    // const key = 'token';
    // await client.rpush(key, token);

    return { message: 'User successfully logged out'};
  }

  // async isTokenBlacklisted(token: string): Promise<boolean> {
  //   const client = await this.redisService.getClient();
  //   const key = 'token';
  //   const allTokens: string[] = await client.lrange(key, 0, -1);
  //   const isBlacklisted = allTokens.includes(token);

  //   return isBlacklisted;
  // }
}
