import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FoodGroup } from '../data/entities/food-group.entity';

@Injectable()
export class FoodGroupsService {
  constructor(@InjectRepository(FoodGroup) private readonly foodGroupsRepository: Repository<FoodGroup>) {}

  async getFoodGroups(): Promise<string[]> {
    const foodGroups = await this.foodGroupsRepository.find({
          order: {
            description: 'ASC',
          },
    });
    const foodGroupsRO = await Promise.all(foodGroups.map(foodGroup => foodGroup.description));
    return foodGroupsRO;
  }
}
