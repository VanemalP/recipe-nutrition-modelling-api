import { FoodGroupsService } from './food-groups.service';
import { Controller, Get } from '@nestjs/common';

@Controller('api/food-groups')
export class FoodGroupsController {
  constructor(private readonly foodGroupsService: FoodGroupsService) {}

  @Get()
  async getFoodGroups(): Promise<string[]> {
    return await this.foodGroupsService.getFoodGroups();
  }
}
