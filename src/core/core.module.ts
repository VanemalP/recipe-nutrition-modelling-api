import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';

import { ConfigModule } from './../config/config.module';
import { ConfigService } from '../config/config.service';
import { User } from '../data/entities/user.entity';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     name: 'blacklist',
    //     host: configService.redisHost,
    //     port: configService.redisPort,
    //     password: configService.redisPassword,
    //   }),
    // }),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class CoreModule {}
