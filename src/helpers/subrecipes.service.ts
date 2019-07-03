import { Recipe } from './../data/entities/recipe.entity';
import { CreateSubrecipeDto } from './../models/subrecipes/create-subrecipe.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subrecipe } from '../data/entities/subrecipe.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubrecipesService {
  constructor(
    @InjectRepository(Subrecipe) private readonly subrecipeRepository: Repository<Subrecipe>,
  ) {}

  async createSubrecipe(subrecipeData: CreateSubrecipeDto, linkedRecipe: Recipe, recipe: Recipe) {
    const subrecipe = new Subrecipe();

    subrecipe.linkedRecipe = linkedRecipe;
    subrecipe.quantity = subrecipeData.quantity;
    subrecipe.unit = subrecipeData.unit;
    subrecipe.recipe = Promise.resolve(recipe);

    return await this.subrecipeRepository.save(subrecipe);
  }

}
