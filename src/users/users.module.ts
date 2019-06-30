import { Module } from '@nestjs/common';

import { AuthModule } from './../auth/auth.module';
import { CoreModule } from '../core/core.module';
import { UsersController } from './users.controller';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [UsersController],
})
export class UsersModule {}
