import { Controller, Get } from '@nestjs/common';

import { CategoriesService } from '../helpers/categories.service';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<string[]> {
    return await this.categoriesService.getCategories();
  }
}
