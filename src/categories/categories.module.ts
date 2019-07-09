import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './../helpers/categories.service';
import { Category } from '../data/entities/categoriy.entity';

@Module({
  controllers: [CategoriesController],
  imports: [ TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
})
export class CategoriesModule {}
