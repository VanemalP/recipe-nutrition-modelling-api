import { ITotalNutrition } from './../common/interfaces/total-nutrition';
import { Recipe } from './../data/entities/recipe.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingredient } from '../data/entities/ingredient.entity';
import { NutrientsEnum } from '../common/enums/nutrients.enum';
import { Nutrition } from '../data/entities/nutrition.entity';
import { Subrecipe } from '../data/entities/subrecipe.entity';

@Injectable()
export class NutritionService {
  constructor(@InjectRepository(Nutrition) private readonly nutritionRepository: Repository<Nutrition>) {}

  async createNutrition(totalIngredientNutrition: any, totalSubrecipeNutrition: any, recipe: Recipe) {
    const nutrition = await this.nutritionRepository.create({
      product: null,
    });
    const nutrientNames = Object.keys(totalIngredientNutrition.nutrition);
    nutrientNames.forEach((nutrientName: NutrientsEnum) => {
      const nutrIngredientValue = totalIngredientNutrition.nutrition[nutrientName].value / totalIngredientNutrition.weight * 100;
      let nutrSubrecipeValue: number;
      if (totalSubrecipeNutrition) {
        nutrSubrecipeValue = totalSubrecipeNutrition.nutrition[nutrientName].value / totalSubrecipeNutrition.weight * 100;
      } else {
        nutrSubrecipeValue = 0;
      }
      nutrition[nutrientName].value = +nutrSubrecipeValue.toFixed(3) + +nutrIngredientValue.toFixed(3);
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
          nutrients[nutrientName].value / 100 * weightInGrams;
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

  calculateSubrecipesTotalNutrition(subrecipes: Subrecipe[]) {
    const calculatedNutrients = subrecipes.map(subrecipe => {

      const weightInGrams = subrecipe.linkedRecipe.amount * subrecipe.quantity;

      const nutrients = {
        PROCNT: subrecipe.linkedRecipe.nutrition.PROCNT,
        FAT: subrecipe.linkedRecipe.nutrition.FAT,
        CHOCDF: subrecipe.linkedRecipe.nutrition.CHOCDF,
        ENERC_KCAL: subrecipe.linkedRecipe.nutrition.ENERC_KCAL,
        SUGAR: subrecipe.linkedRecipe.nutrition.SUGAR,
        FIBTG: subrecipe.linkedRecipe.nutrition.FIBTG,
        CA: subrecipe.linkedRecipe.nutrition.CA,
        FE: subrecipe.linkedRecipe.nutrition.FE,
        P: subrecipe.linkedRecipe.nutrition.P,
        K: subrecipe.linkedRecipe.nutrition.K,
        NA: subrecipe.linkedRecipe.nutrition.NA,
        VITA_IU: subrecipe.linkedRecipe.nutrition.VITA_IU,
        TOCPHA: subrecipe.linkedRecipe.nutrition.TOCPHA,
        VITD: subrecipe.linkedRecipe.nutrition.VITD,
        VITC: subrecipe.linkedRecipe.nutrition.VITC,
        VITB12: subrecipe.linkedRecipe.nutrition.VITB12,
        FOLAC: subrecipe.linkedRecipe.nutrition.FOLAC,
        CHOLE: subrecipe.linkedRecipe.nutrition.CHOLE,
        FATRN: subrecipe.linkedRecipe.nutrition.FATRN,
        FASAT: subrecipe.linkedRecipe.nutrition.FASAT,
        FAMS: subrecipe.linkedRecipe.nutrition.FAMS,
        FAPU: subrecipe.linkedRecipe.nutrition.FAPU,
      };

      const nutrentNames = Object.keys(nutrients);
      nutrentNames.forEach((nutrientName: NutrientsEnum) => {
        nutrients[nutrientName].value =
        nutrients[nutrientName].value / 100 * weightInGrams;
      });

      return {nutrients, weight: weightInGrams};
    });
  }
}
