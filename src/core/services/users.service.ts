import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../data/entities/user.entity';
import { UserDto } from '../../models/users/user.dto';
import { LoginUserDto } from '../../models/users/login-user.dto';
import { RegisterUserDTO } from '../../models/users/register-user.dto';
import { JwtPayload } from '../../common/interfaces/jwt-payload';
import { UserBadRequest } from '../../common/exeptions/user-bad-request';
import { UserNotFound } from '../../common/exeptions/user-not-found';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async register(userData: RegisterUserDTO): Promise<UserDto> {
    const userByUsername = await this.userRepo.findOne({
      where: { username: userData.username },
    });
    if (userByUsername) {
      throw new UserBadRequest('This username is already taken!');
    }
    const userByEmail = await this.userRepo.findOne({
      where: { email: userData.email },
    });
    if (userByEmail) {
      throw new UserBadRequest('This email is already used!');
    }
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const savedUser = await this.userRepo.save({
      ...userData,
      password: passwordHash,
    });

    return this.userToRO(savedUser);
  }

  async signIn(username: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username },
    });
    if (!user) {
      throw new UserNotFound(`User with username ${username} does not exist!`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: { username },
    });
    if (!user) {
      throw new UserNotFound(`User with username ${username} does not exist!`);
    }

    return this.userToRO(user);
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new UserNotFound(`User with email ${email} does not exist!`);
    }

    return this.userToRO(user);
  }

  async validate(payload: JwtPayload): Promise<User> {
    return await this.userRepo.findOne({
      where: { ...payload },
    });
  }

  async validatePassword(user: LoginUserDto): Promise<boolean> {
    const userEntity = await this.userRepo.findOne({
      where: { username: user.username },
    });

    return await bcrypt.compare(user.password, userEntity.password);
  }

  private userToRO(user: User) {
    const userRO = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      joined: user.joined,
    };

    return { user: userRO };
  }
}
