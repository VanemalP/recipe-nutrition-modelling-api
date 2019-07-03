import { Recipe } from './../data/entities/recipe.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingredient } from '../data/entities/ingredient.entity';
import { NutrientsEnum } from '../common/enums/nutrients.enum';
import { Nutrition } from '../data/entities/nutrition.entity';
import { INutrition } from '../common/interfaces/nutrition';

@Injectable()
export class NutritionService {
  constructor(@InjectRepository(Nutrition) private readonly nutritionRepository: Repository<Nutrition>) {}

  async createNutrition(totalRecipeNutrition: INutrition, weight: number, recipe: Recipe) {
    const nutrientNames = Object.keys(totalRecipeNutrition);
    nutrientNames.forEach((nutrientName: NutrientsEnum) => {
      const nutrValue = totalRecipeNutrition[nutrientName].value / weight * 100;
      totalRecipeNutrition[nutrientName].value = +nutrValue.toFixed(3);
    });
    const nutrition = await this.nutritionRepository.create({
      product: null,
      ...totalRecipeNutrition,
    });

    const recipeNutrition = await this.nutritionRepository.save(nutrition);

    return recipeNutrition;
  }

  calculateIngredientsTotalNutrition(ingredients: Ingredient[]) {
    const calculatedNutrients = ingredients.map(ingredient => {
      const measureOfIngredient = ingredient.product.measures.find(
        measure => `${measure.amount.toString()} ${measure.measure}` === ingredient.unit,
      );

      const weightInGrams = measureOfIngredient.gramsPerMeasure * ingredient.quantity;

      const nutrients = {
        PROCNT: ingredient.product.nutrition.PROCNT,
        FAT: ingredient.product.nutrition.FAT,
        CHOCDF: ingredient.product.nutrition.CHOCDF,
        ENERC_KCAL: ingredient.product.nutrition.ENERC_KCAL,
        SUGAR: ingredient.product.nutrition.SUGAR,
        FIBTG: ingredient.product.nutrition.FIBTG,
        CA: ingredient.product.nutrition.CA,
        FE: ingredient.product.nutrition.FE,
        P: ingredient.product.nutrition.P,
        K: ingredient.product.nutrition.K,
        NA: ingredient.product.nutrition.NA,
        VITA_IU: ingredient.product.nutrition.VITA_IU,
        TOCPHA: ingredient.product.nutrition.TOCPHA,
        VITD: ingredient.product.nutrition.VITD,
        VITC: ingredient.product.nutrition.VITC,
        VITB12: ingredient.product.nutrition.VITB12,
        FOLAC: ingredient.product.nutrition.FOLAC,
        CHOLE: ingredient.product.nutrition.CHOLE,
        FATRN: ingredient.product.nutrition.FATRN,
        FASAT: ingredient.product.nutrition.FASAT,
        FAMS: ingredient.product.nutrition.FAMS,
        FAPU: ingredient.product.nutrition.FAPU,
      };

      const nutrientNames = Object.keys(nutrients);
      nutrientNames.forEach((nutrientName: NutrientsEnum) => {
        nutrients[nutrientName].value =
          (nutrients[nutrientName].value * weightInGrams) / 100;
      });

      return {nutrients, weight: weightInGrams};
    });

    const nutrs = calculatedNutrients.reduce((acc, curr) => {
      const nutrientNames = Object.keys(curr.nutrients);
      nutrientNames.forEach((nutrientName: NutrientsEnum) => {
        acc.nutrients[nutrientName].value += curr.nutrients[nutrientName].value;
      });
      acc.weight += curr.weight;

      return acc;
    });

    return nutrs;
  }
}
