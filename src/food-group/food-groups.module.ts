import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FoodGroup } from './../data/entities/food-group.entity';
import { FoodGroupsController } from './food-groups.controller';
import { FoodGroupsService } from './food-groups.service';

@Module({
  controllers: [FoodGroupsController],
  imports: [ TypeOrmModule.forFeature([FoodGroup])],
  providers: [FoodGroupsService],
})
export class FoodGroupsModule {}
