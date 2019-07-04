import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './../data/entities/categoriy.entity';
import { CategoryNotFound } from '../common/exeptions/category-not-found';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategoryByName(name: string): Promise<Category> {
    const foundCategory = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (!foundCategory) {
      throw new CategoryNotFound('No such category');
    }

    return foundCategory;
  }
}
