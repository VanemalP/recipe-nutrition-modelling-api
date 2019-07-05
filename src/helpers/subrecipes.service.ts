import { Recipe } from './../data/entities/recipe.entity';
import { CreateSubrecipeDto } from './../models/subrecipes/create-subrecipe.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subrecipe } from '../data/entities/subrecipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubrecipeNotFound } from '../common/exeptions/subrecipe-not-found';
import { UpdateSubrecipeDto } from '../models/subrecipes/update-subrecipe.dto';

@Injectable()
export class SubrecipesService {
  constructor(
    @InjectRepository(Subrecipe) private readonly subrecipeRepository: Repository<Subrecipe>,
  ) {}

  async createSubrecipe(subrecipeData: CreateSubrecipeDto, linkedRecipe: Recipe, recipe: Recipe) {
    const subrecipe = new Subrecipe();

    subrecipe.linkedRecipe = Promise.resolve(linkedRecipe);
    subrecipe.quantity = subrecipeData.quantity;
    subrecipe.unit = subrecipeData.unit;
    subrecipe.recipe = Promise.resolve(recipe);
    return await this.subrecipeRepository.save(subrecipe);
  }

  async findSubrecipeById(id: string): Promise<Subrecipe> {
    const foundSubrecipe = await this.subrecipeRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!foundSubrecipe) {
      throw new SubrecipeNotFound('No such subrecipe');
    }

    return foundSubrecipe;
  }

  async updateSubrecipe(updateData: UpdateSubrecipeDto): Promise<Subrecipe> {
    const subrecipeToUpdate = await this.findSubrecipeById(updateData.id);

    if (updateData.isDeleted) {
      subrecipeToUpdate.isDeleted = updateData.isDeleted;
    }
    if (updateData.quantity) {
      subrecipeToUpdate.quantity = updateData.quantity;
    }
    if (updateData.unit) {
      subrecipeToUpdate.unit = updateData.unit;
    }

    return await this.subrecipeRepository.save(subrecipeToUpdate);
  }

  async deleteSubrecipe(id: string) {
    const subrecipeToDelete = await this.findSubrecipeById(id);

    subrecipeToDelete.isDeleted = true;

    return await this.subrecipeRepository.save(subrecipeToDelete);
  }
}
