import { ITotalNutrition } from './../common/interfaces/total-nutrition';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingredient } from '../data/entities/ingredient.entity';
import { NutrientsEnum } from '../common/enums/nutrients.enum';
import { Nutrition } from '../data/entities/nutrition.entity';
import { Subrecipe } from '../data/entities/subrecipe.entity';
import { NutritionNotFound } from '../common/exeptions/nutrition-not-found';

@Injectable()
export class NutritionService {
  constructor(@InjectRepository(Nutrition) private readonly nutritionRepository: Repository<Nutrition>) {}

  async createNutrition(allNutrients: ITotalNutrition): Promise<Nutrition> {
    const nutrientNames = Object.keys(allNutrients.nutrients);
    nutrientNames.forEach((nutrientName: NutrientsEnum) => {
      const nutrValue = allNutrients.nutrients[nutrientName].value / allNutrients.weight * 100;
      allNutrients.nutrients[nutrientName].value = +nutrValue.toFixed(3);
    });
    const nutrition = await this.nutritionRepository.create({
      product: null,
      ...allNutrients.nutrients,
    });

    const recipeNutrition = await this.nutritionRepository.save(nutrition);

    return recipeNutrition;
  }

  calculateIngredientsTotalNutrition(ingredients: Ingredient[]): ITotalNutrition {
    const calculatedNutrients = ingredients.map(ingredient => {
      const measureOfIngredient = ingredient.product.measures.find(
        measure => `${measure.amount.toString()} ${measure.measure}` === ingredient.unit,
      );
      const weightInGrams = ingredient.isDeleted ? 0 : measureOfIngredient.gramsPerMeasure * ingredient.quantity;

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
      if (!ingredient.isDeleted) {
        nutrientNames.forEach((nutrientName: NutrientsEnum) => {
          nutrients[nutrientName].value =
            nutrients[nutrientName].value / 100 * weightInGrams;
        });
      } else {
        nutrientNames.forEach((nutrientName: NutrientsEnum) => {
          nutrients[nutrientName].value = 0;
        });
      }
      console.log({nutrients, weight: weightInGrams});
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

  async calculateSubrecipesTotalNutrition(subrecipes: Subrecipe[]): Promise<ITotalNutrition> {
    const calculatedNutrients = await Promise.all(subrecipes.map(async (subrecipe) => {
      const linkedRecipe = await subrecipe.linkedRecipe;
      const weightInGrams = subrecipe.isDeleted ? 0 : linkedRecipe.amount * subrecipe.quantity;

      const nutrients = {
        PROCNT: linkedRecipe.nutrition.PROCNT,
        FAT: linkedRecipe.nutrition.FAT,
        CHOCDF: linkedRecipe.nutrition.CHOCDF,
        ENERC_KCAL: linkedRecipe.nutrition.ENERC_KCAL,
        SUGAR: linkedRecipe.nutrition.SUGAR,
        FIBTG: linkedRecipe.nutrition.FIBTG,
        CA: linkedRecipe.nutrition.CA,
        FE: linkedRecipe.nutrition.FE,
        P: linkedRecipe.nutrition.P,
        K: linkedRecipe.nutrition.K,
        NA: linkedRecipe.nutrition.NA,
        VITA_IU: linkedRecipe.nutrition.VITA_IU,
        TOCPHA: linkedRecipe.nutrition.TOCPHA,
        VITD: linkedRecipe.nutrition.VITD,
        VITC: linkedRecipe.nutrition.VITC,
        VITB12: linkedRecipe.nutrition.VITB12,
        FOLAC: linkedRecipe.nutrition.FOLAC,
        CHOLE: linkedRecipe.nutrition.CHOLE,
        FATRN: linkedRecipe.nutrition.FATRN,
        FASAT: linkedRecipe.nutrition.FASAT,
        FAMS: linkedRecipe.nutrition.FAMS,
        FAPU: linkedRecipe.nutrition.FAPU,
      };

      // const nutrentNames = Object.keys(nutrients);
      // nutrentNames.forEach((nutrientName: NutrientsEnum) => {
      //   nutrients[nutrientName].value =
      //   nutrients[nutrientName].value / 100 * weightInGrams;
      // });

      const nutrientNames = Object.keys(nutrients);
      if (!subrecipe.isDeleted) {
        nutrientNames.forEach((nutrientName: NutrientsEnum) => {
          nutrients[nutrientName].value =
          nutrients[nutrientName].value / 100 * weightInGrams;
        });
      } else {
        nutrientNames.forEach((nutrientName: NutrientsEnum) => {
          nutrients[nutrientName].value = 0;
        });
      }

      return {nutrients, weight: weightInGrams};
    })).then(result => result);

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

  async updateNutrition(nutrition: Nutrition, allNutrients: ITotalNutrition): Promise<Nutrition> {
    const nutrientNames = Object.keys(allNutrients.nutrients);
    nutrientNames.forEach((nutrientName: NutrientsEnum) => {
      const nutrValue = allNutrients.nutrients[nutrientName].value / allNutrients.weight * 100;
      // allNutrients.nutrients[nutrientName].value = +nutrValue.toFixed(3);
      nutrition[nutrientName].value = +nutrValue.toFixed(3);
    });

    return await this.nutritionRepository.save(nutrition);
  }

  async deleteNutrition(id: string) {
    const nutritionToDelete = await this.nutritionRepository.findOne({
      where: {
        id,
      },
    });

    if (!nutritionToDelete) {
      throw new NutritionNotFound('Nutrition does not exist');
    }

    nutritionToDelete.isDeleted = true;

    return await this.nutritionRepository.save(nutritionToDelete);
  }

  async findNutritionById(id: string): Promise<Nutrition> {
    const foundNutrition = await this.nutritionRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
    if (!foundNutrition) {
      throw new NutritionNotFound('No such nutrition');
    }

    return foundNutrition;
  }
}
