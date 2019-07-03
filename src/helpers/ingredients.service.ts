import { NutritionService } from './nutrition.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingredient } from '../data/entities/ingredient.entity';
import { CreateIngredientDto } from '../models/ingredients/create-ingredient.dto';
import { ProductsService } from '../products/products.service';
import { Recipe } from '../data/entities/recipe.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
    private readonly productsService: ProductsService,
    private readonly nutritionService: NutritionService,
  ) {}

  async createIngredient(ingredientData: CreateIngredientDto, recipe: Recipe) {
    const product = await this.productsService.getProductByCode(ingredientData.productCode);
    const ingredient = new Ingredient();

    ingredient.product = product;
    ingredient.quantity = ingredientData.quantity;
    ingredient.unit = ingredientData.unit;
/////////////////////////////
    ingredient.recipe = Promise.resolve(recipe);
    // await this.ingredientRepository.save(ingredient);

    // const measureOfIngredient = product.measures.find((measure) => `${measure.amount.toString()} ${measure.measure}` === ingredient.unit);
    // const weightInGrams = measureOfIngredient.gramsPerMeasure * ingredient.quantity;

    // const totalNutrition = this.nutritionService.calculateNutrition(weightInGrams, product.nutrition);

    // return {weightInGrams, totalNutrition};
/////////////////////////////
    return await this.ingredientRepository.save(ingredient);
  }
}
