import { NutritionService } from './nutrition.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingredient } from '../data/entities/ingredient.entity';
import { CreateIngredientDto } from '../models/ingredients/create-ingredient.dto';
import { ProductsService } from '../products/products.service';
import { Recipe } from '../data/entities/recipe.entity';
import { IngredientNotFound } from '../common/exeptions/ingredient-not-found';
import { UpdateIngredientDto } from '../models/ingredients/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
    private readonly productsService: ProductsService,
    private readonly nutritionService: NutritionService,
  ) {}

  async createIngredient(ingredientData: CreateIngredientDto, recipe: Recipe): Promise<Ingredient> {
    const product = await this.productsService.getProductByCode(ingredientData.productCode);
    const ingredient = new Ingredient();

    ingredient.product = product;
    ingredient.quantity = ingredientData.quantity;
    ingredient.unit = ingredientData.unit;
    if (!recipe.ingredients) {
      ingredient.recipe = Promise.resolve(recipe);
    }

    return await this.ingredientRepository.save(ingredient);
  }

  async findIngredientById(id: string): Promise<Ingredient> {
    const foundIngredient = await this.ingredientRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!foundIngredient) {
      throw new IngredientNotFound('No such ingredient');
    }

    return foundIngredient;
  }

  async updateIngredient(updateData: UpdateIngredientDto): Promise<Ingredient> {
    const ingredientToUpdate = await this.findIngredientById(updateData.id);

    if (updateData.isDeleted) {
      console.log('delete ingredient');
      ingredientToUpdate.isDeleted = updateData.isDeleted;
    }
    if (updateData.quantity) {
      ingredientToUpdate.quantity = updateData.quantity;
    }
    if (updateData.unit) {
      ingredientToUpdate.unit = updateData.unit;
    }

    return await this.ingredientRepository.save(ingredientToUpdate);
  }

  async deleteIngredientByRecipeId(id: string) {
    const ingredientToDelete =  await this.findIngredientById(id);

    ingredientToDelete.isDeleted = true;

    return await this.ingredientRepository.save(ingredientToDelete);
  }
}
